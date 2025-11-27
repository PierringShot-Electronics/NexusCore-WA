import type { Request, Response } from 'express';
import { Router } from 'express';
import { getLogHistory, subscribeLogs } from '../utils/logStream';
import { wahaClient } from '../services/agent/wahaClient';
import { env } from '../config/env';

export function createAdminRouter(): Router {
  const router = Router();

  router.get('/status', async (_req, res) => {
    const session = await wahaClient.getSessionStatus();
    res.json({
      backend: { status: 'ok', time: new Date().toISOString() },
      waha: session,
      env: {
        appPort: env.APP_PORT,
        wahaSession: env.WAHA_SESSION
      }
    });
  });

  router.get('/qr', async (_req, res) => {
    const qr = await wahaClient.getSessionQr();
    res.json(qr ?? { error: 'qr_not_available' });
  });

  router.get('/logs/history', (_req, res) => {
    res.json(getLogHistory());
  });

  router.get('/logs/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const send = (data: unknown) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    getLogHistory().forEach(send);

    const unsubscribe = subscribeLogs((entry) => send(entry));

    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  });

  router.post('/handover', (req, res) => {
    const chatId: string | undefined = req.body?.chatId;
    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    // Future: persist chatId in a handover list to stop AI responses
    res.json({ status: 'accepted', chatId });
  });

  return router;
}
