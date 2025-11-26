import { randomUUID } from 'crypto';
import { BufferedMessagePayload, BufferedMessageType } from './smartBuffer';

export interface WahaWebhookRequest {
  messages?: Array<{
    id: string;
    from: string;
    type: string;
    timestamp?: string;
    text?: { body: string };
    audio?: { url: string; mime_type?: string };
    image?: { url: string; mime_type?: string };
    status?: string;
    [key: string]: unknown;
  }>;
  contacts?: Array<{
    wa_id: string;
    profile?: { name?: string };
  }>;
  [key: string]: unknown;
}

export interface ParsedIncomingMessage {
  chatId: string;
  message: BufferedMessagePayload;
}

export function parseWahaWebhookBody(
  body: unknown
): ParsedIncomingMessage | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as WahaWebhookRequest;
  const [firstMessage] = payload.messages ?? [];

  if (!firstMessage) {
    return null;
  }

  const chatId = firstMessage.from;

  if (!chatId) {
    return null;
  }

  const type = mapMessageType(firstMessage.type);

  const timestampSeconds = firstMessage.timestamp
    ? Number(firstMessage.timestamp)
    : null;

  let receivedAtMs: number;
  if (timestampSeconds && !Number.isNaN(timestampSeconds)) {
    receivedAtMs = timestampSeconds * 1000;
  } else {
    receivedAtMs = Date.now();
  }

  const message: BufferedMessagePayload = {
    id: firstMessage.id ?? randomUUID(),
    type,
    text: firstMessage.text?.body,
    audioUrl: firstMessage.audio?.url,
    imageUrl: firstMessage.image?.url,
    raw: firstMessage,
    receivedAt: new Date(receivedAtMs).toISOString()
  };

  return { chatId, message };
}

function mapMessageType(type?: string): BufferedMessageType {
  if (!type) {
    return 'unknown';
  }

  switch (type) {
    case 'text':
      return 'text';
    case 'audio':
      return 'audio';
    case 'image':
      return 'image';
    default:
      return 'unknown';
  }
}
