import http from 'http';
import { createServer } from './server';
import { env } from './config/env';
import { wwebGateway } from './wweb/client';
import { logger } from './logger';

async function bootstrap(): Promise<void> {
  const app = createServer();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'WWeb.js gateway listening');
  });

  try {
    await wwebGateway.start();
  } catch (error) {
    logger.error({ err: error }, 'Initial WWeb.js bootstrap failed (will require manual start)');
  }

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');
    try {
      await wwebGateway.stop();
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
  logger.error({ err: error }, 'Fatal error while starting gateway');
  process.exit(1);
});
