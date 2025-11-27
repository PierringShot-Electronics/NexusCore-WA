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
    const session = await wahaClient.getSessionStatus();

    if (!session) {
      return res.status(503).json({ error: 'status_unavailable' });
    }

    const normalizeStatus = (value: string | undefined): string => {
      if (!value) return 'UNKNOWN';
      return value.toUpperCase();
    };

    let status = normalizeStatus(session.status);

    if (status === 'WORKING' || status === 'CONNECTED') {
      return res.json({ error: 'session_already_authenticated', status });
    }

    if (status === 'STOPPED') {
      const started = await wahaClient.startSession();
      if (!started) {
        return res.status(503).json({ error: 'session_start_failed', status });
      }
      const refreshed = await wahaClient.getSessionStatus();
      status = normalizeStatus(refreshed?.status);
    }

    const qr = await wahaClient.getSessionQr();

    if (!qr) {
      return res.status(202).json({ error: 'qr_not_available', status });
    }

    if ('error' in qr) {
      return res.status(202).json({ ...qr, status: qr.status ?? status });
    }

    return res.json({ ...qr, status });
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
