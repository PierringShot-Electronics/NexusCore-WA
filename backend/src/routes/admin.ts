import type { Request, Response } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { getLogHistory, subscribeLogs } from '../utils/logStream';
import { whatsappGatewayClient } from '../services/agent/whatsappGatewayClient';
import { env } from '../config/env';
import {
  getAgentConfig,
  getAgentConfigMetadata,
  parseAgentConfigUpdate,
  updateAgentConfig
} from '../config/agentConfig';
import {
  getBusinessPromptInfo,
  writeBusinessPrompt
} from '../services/agent/promptLoader';
import {
  getEditableEnvEntries,
  getEnvMetadata,
  updateEditableEnv
} from '../services/admin/envManager';

export function createAdminRouter(): Router {
  const router = Router();

  router.get('/status', async (_req, res) => {
    const session = await whatsappGatewayClient.getSessionStatus();
    res.json({
      backend: { status: 'ok', time: new Date().toISOString() },
      whatsappGateway: session,
      env: {
        appPort: env.APP_PORT,
        whatsappSession: env.WHATSAPP_GATEWAY_SESSION
      }
    });
  });

  router.get('/config', async (_req, res) => {
    const [prompt, envEntries, envMeta, agentMeta] = await Promise.all([
      getBusinessPromptInfo(),
      getEditableEnvEntries(),
      getEnvMetadata(),
      getAgentConfigMetadata()
    ]);

    res.json({
      prompt,
      env: {
        entries: envEntries,
        path: envMeta.path,
        updatedAt: envMeta.updatedAt
      },
      agent: {
        settings: getAgentConfig(),
        path: agentMeta.path,
        updatedAt: agentMeta.updatedAt
      }
    });
  });

  router.get('/qr', async (_req, res) => {
    const session = await whatsappGatewayClient.getSessionStatus();

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
      const started = await whatsappGatewayClient.startSession();
      if (!started) {
        return res.status(503).json({ error: 'session_start_failed', status });
      }
      const refreshed = await whatsappGatewayClient.getSessionStatus();
      status = normalizeStatus(refreshed?.status);
    }

    const qr = await whatsappGatewayClient.getSessionQr();

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

  const PromptUpdateSchema = z.object({
    content: z
      .string()
      .min(10, 'Prompt məzmunu ən azı 10 simvol olmalıdır.')
  });

  router.put('/config/prompt', async (req, res) => {
    try {
      const payload = PromptUpdateSchema.parse(req.body);
      const result = await writeBusinessPrompt(payload.content);
      res.json({
        status: 'updated',
        prompt: {
          content: payload.content,
          path: result.path,
          updatedAt: result.updatedAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'invalid_prompt', details: error.errors });
      }
      res.status(500).json({ error: 'prompt_update_failed' });
    }
  });

  const EnvUpdateSchema = z.object({
    entries: z
      .array(
        z.object({
          key: z.string().min(1),
          value: z.string()
        })
      )
      .min(1, 'Ən azı bir dəyişiklik göndərin.')
  });

  router.put('/config/env', async (req, res) => {
    try {
      const payload = EnvUpdateSchema.parse(req.body);
      const entries = await updateEditableEnv(payload.entries);
      const meta = await getEnvMetadata();

      res.json({
        status: 'updated',
        env: {
          entries,
          path: meta.path,
          updatedAt: meta.updatedAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'invalid_env_request', details: error.flatten() });
      }
      res.status(500).json({ error: 'env_update_failed', message: (error as Error).message });
    }
  });

  router.put('/config/agent', async (req, res) => {
    try {
      const update = parseAgentConfigUpdate(req.body);
      const updated = await updateAgentConfig(update);
      const meta = await getAgentConfigMetadata();
      res.json({
        status: 'updated',
        agent: {
          settings: updated,
          path: meta.path,
          updatedAt: meta.updatedAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'invalid_agent_config', details: error.flatten() });
      }
      res.status(500).json({ error: 'agent_config_update_failed', message: (error as Error).message });
    }
  });

  return router;
}
