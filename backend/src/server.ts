import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { createWebhookRouter } from './routes/webhook';
import type { SmartBuffer } from './services/buffer/smartBuffer';

export function createApp(buffer: SmartBuffer): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/healthz', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/webhook', createWebhookRouter(buffer));

  return app;
}
