import { Router } from 'express';
import { SmartBuffer } from '../services/buffer/smartBuffer';
import { logger } from '../utils/logger';
import { parseWahaWebhookBody } from '../services/buffer/parser';

export function createWebhookRouter(buffer: SmartBuffer): Router {
  const router = Router();

  router.post('/', async (request, response) => {
    const parsed = parseWahaWebhookBody(request.body);

    if (!parsed) {
      logger.debug(
        { payload: request.body },
        'WAHA webhook payload ignored (unsupported format)'
      );
      // Gracefully ignore unsupported payloads (ack required by WAHA).
      return response.status(202).json({ status: 'ignored' });
    }

    await buffer.enqueue(parsed.chatId, parsed.message);

    return response.status(200).json({ status: 'buffered' });
  });

  router.post('/flush', async (request, response) => {
    const chatId: string | undefined = request.body?.chatId;
    if (!chatId) {
      return response.status(400).json({ error: 'chatId is required' });
    }

    await buffer.flush(chatId);
    return response.status(200).json({ status: 'flushed' });
  });

  // Administrative endpoint to replay all buffers (useful during graceful shutdowns).
  router.post('/flush-all', async (_request, response) => {
    await buffer.flushAll();
    return response.status(200).json({ status: 'flushed-all' });
  });

  return router;
}
