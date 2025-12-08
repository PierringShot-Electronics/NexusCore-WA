import http from 'http';
import { env } from './config/env';
import { createApp } from './server';
import { connectPostgres, disconnectPostgres } from './db/postgres';
import { connectRedis, disconnectRedis, redis } from './db/redis';
import { SmartBuffer } from './services/buffer/smartBuffer';
import { agentService } from './services/agent/agentService';
import { logger } from './utils/logger';
import { whatsappGatewayClient } from './services/agent/whatsappGatewayClient';
import { registerTelemetryStorage } from './services/telemetry/storage';

async function bootstrap(): Promise<void> {
  await connectPostgres();
  await connectRedis();
  registerTelemetryStorage();

  const buffer = new SmartBuffer({
    redisClient: redis,
    bufferTimeoutMs: env.BUFFER_TIMEOUT_MS,
    onFlush: async (chatId, messages) => {
      await agentService.handleBufferedMessages({
        chatExternalId: chatId,
        bufferedMessages: messages
      });
    }
  });

  const app = createApp(buffer);
  const server = http.createServer(app);

  server.listen(env.APP_PORT, () => {
    logger.info(
      { port: env.APP_PORT, env: env.NODE_ENV },
      'WhatsCore backend listening'
    );
  });

  setTimeout(() => {
    whatsappGatewayClient.ensureWebhookSubscription().catch((error) => {
      logger.error({ err: error }, 'Failed to configure WhatsApp gateway webhook subscription');
    });
  }, 5000);

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');
    try {
      await buffer.flushAll();
      await disconnectRedis();
      await disconnectPostgres();
    } catch (error) {
      logger.error({ err: error }, 'Error during shutdown');
    } finally {
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    }
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Fatal error while bootstrapping application');
  process.exit(1);
});
