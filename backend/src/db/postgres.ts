import { Pool } from 'pg';
import { registerType } from 'pgvector/pg';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const postgresPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: 30_000
});

registerType(postgresPool);

postgresPool.on('error', (error: Error) => {
  logger.error({ err: error }, 'Unexpected Postgres client error');
});

export async function connectPostgres(): Promise<void> {
  const client = await postgresPool.connect();
  client.release();
  logger.info('Postgres pool connected');
}

export async function disconnectPostgres(): Promise<void> {
  await postgresPool.end();
  logger.info('Postgres pool disconnected');
}
