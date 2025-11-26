import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { OpenAI } from 'openai';
import { env } from '../src/config/env';
import { postgresPool } from '../src/db/postgres';
import { logger } from '../src/utils/logger';
import { toSql } from 'pgvector/pg';

interface CsvProductRow {
  sku?: string;
  name: string;
  category?: string;
  cost?: string;
  price?: string;
  stock?: string;
  metadata?: string;
}

async function main(): Promise<void> {
  const csvPath = path.resolve(__dirname, '../../data/products.csv');
  const fileContents = await readFile(csvPath, 'utf-8');
  const rows = parse(fileContents, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvProductRow[];

  const openai =
    env.OPENAI_API_KEY != null
      ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
      : null;

  const client = await postgresPool.connect();

  try {
    for (const row of rows) {
      const {
        sku,
        name,
        category,
        cost,
        price,
        stock,
        metadata: metadataRaw
      } = row;

      const costValue = cost ? Number(cost) : null;
      const priceValue = price ? Number(price) : null;
      const stockValue = stock ? Number(stock) : null;
      let metadata: Record<string, unknown> | null = null;
      if (metadataRaw) {
        try {
          metadata = JSON.parse(metadataRaw);
        } catch (error) {
          logger.warn(
            { sku, err: error },
            'Skipping metadata JSON parse for product row'
          );
        }
      }

      const product = await client.query<{
        id: string;
      }>(
        `INSERT INTO products (sku, name, category, cost, price, stock, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (sku) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           cost = EXCLUDED.cost,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           metadata = COALESCE(EXCLUDED.metadata, products.metadata),
           updated_at = now()
         RETURNING id`,
        [
          sku ?? null,
          name,
          category ?? null,
          costValue,
          priceValue,
          stockValue,
          metadata
        ]
      );

      const productRow = product.rows[0];
      if (!productRow) {
        logger.warn({ sku, name }, 'Skipping product upsert without returned id');
        continue;
      }

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
        await client.query(
          `INSERT INTO product_embeddings (product_id, embedding)
           VALUES ($1, $2)
           ON CONFLICT (product_id) DO UPDATE SET embedding = EXCLUDED.embedding`,
          [productRow.id, toSql(embedding.embedding)]
        );
      }
    }

    logger.info({ count: rows.length }, 'Seeded product catalog');
  } finally {
    client.release();
    await postgresPool.end();
  }
}

main().catch((error) => {
  logger.error({ err: error }, 'Product seeding failed');
  process.exit(1);
});
