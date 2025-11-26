"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const sync_1 = require("csv-parse/sync");
const openai_1 = require("openai");
const env_1 = require("../src/config/env");
const postgres_1 = require("../src/db/postgres");
const logger_1 = require("../src/utils/logger");
const pg_1 = require("pgvector/pg");
async function main() {
    const csvPath = node_path_1.default.resolve(__dirname, '../../data/products.csv');
    const fileContents = await (0, promises_1.readFile)(csvPath, 'utf-8');
    const rows = (0, sync_1.parse)(fileContents, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
    const openai = env_1.env.OPENAI_API_KEY != null
        ? new openai_1.OpenAI({ apiKey: env_1.env.OPENAI_API_KEY })
        : null;
    const client = await postgres_1.postgresPool.connect();
    try {
        for (const row of rows) {
            const { sku, name, category, cost, price, stock, metadata: metadataRaw } = row;
            const costValue = cost ? Number(cost) : null;
            const priceValue = price ? Number(price) : null;
            const stockValue = stock ? Number(stock) : null;
            let metadata = null;
            if (metadataRaw) {
                try {
                    metadata = JSON.parse(metadataRaw);
                }
                catch (error) {
                    logger_1.logger.warn({ sku, err: error }, 'Skipping metadata JSON parse for product row');
                }
            }
            const product = await client.query(`INSERT INTO products (sku, name, category, cost, price, stock, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (sku) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           cost = EXCLUDED.cost,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           metadata = COALESCE(EXCLUDED.metadata, products.metadata),
           updated_at = now()
         RETURNING id`, [
                sku ?? null,
                name,
                category ?? null,
                costValue,
                priceValue,
                stockValue,
                metadata
            ]);
            if (!openai) {
                continue;
            }
            const embeddingInput = [name, category, metadataRaw]
                .filter(Boolean)
                .join(' ');
            const embeddingResponse = await openai.embeddings.create({
                input: embeddingInput,
                model: 'text-embedding-3-large'
            });
            const [embedding] = embeddingResponse.data;
            if (embedding) {
                await client.query(`INSERT INTO product_embeddings (product_id, embedding)
           VALUES ($1, $2)
           ON CONFLICT (product_id) DO UPDATE SET embedding = EXCLUDED.embedding`, [product.rows[0].id, (0, pg_1.toSql)(embedding.embedding)]);
            }
        }
        logger_1.logger.info({ count: rows.length }, 'Seeded product catalog');
    }
    finally {
        client.release();
        await postgres_1.postgresPool.end();
    }
}
main().catch((error) => {
    logger_1.logger.error({ err: error }, 'Product seeding failed');
    process.exit(1);
});
