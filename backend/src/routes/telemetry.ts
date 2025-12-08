import { Router, type Response } from 'express';
import { telemetryEventBus, type TelemetryEvent } from '../services/telemetry/eventBus';
import { getTelemetryHistory } from '../services/telemetry/storage';
import { env } from '../config/env';

type SSEWrite = (data: string) => void;

function writeEvent(response: Response, event: TelemetryEvent): void {
  const payload = JSON.stringify(event);
  response.write(`id: ${event.id}\n`);
  response.write(`event: telemetry\n`);
  response.write(`data: ${payload}\n\n`);
}

export function createTelemetryRouter(): Router {
  const router = Router();

  router.get('/stream', async (request, response) => {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache, no-transform');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders?.();

    const lastEventId = typeof request.headers['last-event-id'] === 'string'
      ? request.headers['last-event-id']
      : undefined;
    try {
      const history = await getTelemetryHistory({
        afterId: lastEventId,
        limit: env.TELEMETRY_HISTORY_LIMIT
      });
      history.forEach((event) => writeEvent(response, event));
    } catch (error) {
      response.write(`event: error\n`);
      response.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
    }

    const heartbeat = setInterval(() => {
      response.write(': heartbeat\n\n');
    }, 15000);

    const unsubscribe = telemetryEventBus.on((event) => {
      writeEvent(response, event);
    });

    request.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
      response.end();
    });
  });

  router.get('/history', async (_request, response) => {
    const events = await getTelemetryHistory({ limit: env.TELEMETRY_HISTORY_LIMIT });
    response.json({ events });
  });

  return router;
}
