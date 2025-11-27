import { Pool } from 'pg';
import pgvector from 'pgvector/pg';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const postgresPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: 30_000
});

postgresPool.on('error', (error: Error) => {
  logger.error({ err: error }, 'Unexpected Postgres client error');
});

postgresPool.on('connect', (client) => {
  pgvector
    .registerType(client)
    .catch((error: Error) => {
      logger.error({ err: error }, 'Failed to register pgvector type');
    });
});

export async function connectPostgres(): Promise<void> {
  const client = await postgresPool.connect();
  try {
    await pgvector.registerType(client);
  } catch (error) {
    logger.error({ err: error }, 'Failed to register pgvector type for initial client');
  }
  client.release();
  logger.info('Postgres pool connected');
}

export async function disconnectPostgres(): Promise<void> {
  await postgresPool.end();
  logger.info('Postgres pool disconnected');
}
