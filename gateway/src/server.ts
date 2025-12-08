import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createApiRouter } from './routes/api';

export function createServer(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/ping', (_request, response) => {
    response.json({ status: 'pong' });
  });

  app.use('/api', createApiRouter());

  return app;
}
