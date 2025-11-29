import pgvector from 'pgvector/pg';
import { postgresPool } from '../../db/postgres';
import { openaiClient, hasOpenAI } from '../../config/ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface StockMatch {
  id: string;
  name: string;
  sku: string | null;
  cost: number | null;
  price: number | null;
  stock: number | null;
  currency: string | null;
}

export interface StockLookupResult {
  matches: StockMatch[];
  strategy: 'vector' | 'keyword';
}

export async function lookupInternalStock(query: string): Promise<StockLookupResult> {
  if (!query.trim()) {
    return { matches: [], strategy: 'keyword' };
  }

  if (hasOpenAI && openaiClient) {
    try {
      const embedding = await openaiClient.embeddings.create({
        input: query,
        model: env.OPENAI_EMBEDDING_MODEL
      });

      const vector = embedding.data[0]?.embedding;
      if (vector) {
        const { rows } = await postgresPool.query<StockMatch>(
          `SELECT p.id,
                  p.name,
                  p.sku,
                  p.cost,
                  p.price,
                  p.stock,
                  p.currency
           FROM product_embeddings pe
           JOIN products p ON p.id = pe.product_id
           ORDER BY pe.embedding <-> $1
           LIMIT 3`,
          [pgvector.toSql(vector)]
        );

        return { matches: rows, strategy: 'vector' };
      }
    } catch (error) {
      logger.warn({ err: error }, 'Vector lookup failed. Falling back to keyword search');
    }
  }

  const { rows } = await postgresPool.query<StockMatch>(
    `SELECT id,
            name,
            sku,
            cost,
            price,
            stock,
            currency
     FROM products
     WHERE name ILIKE '%' || $1 || '%'
        OR sku ILIKE '%' || $1 || '%'
     ORDER BY updated_at DESC
     LIMIT 3`,
    [query]
  );

  return { matches: rows, strategy: 'keyword' };
}
