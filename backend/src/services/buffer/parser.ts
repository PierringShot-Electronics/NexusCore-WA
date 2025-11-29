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
    voice?: { url: string; mime_type?: string };
    image?: { url: string; mime_type?: string };
    video?: { url: string; mime_type?: string };
    document?: { url: string; mime_type?: string; filename?: string };
    caption?: string;
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
    audioUrl: firstMessage.audio?.url ?? firstMessage.voice?.url,
    imageUrl: firstMessage.image?.url,
    videoUrl: firstMessage.video?.url,
    documentUrl: firstMessage.document?.url,
    mimeType:
      firstMessage.audio?.mime_type ??
      firstMessage.voice?.mime_type ??
      firstMessage.image?.mime_type ??
      firstMessage.video?.mime_type ??
      firstMessage.document?.mime_type,
    caption: typeof firstMessage.caption === 'string' ? firstMessage.caption : undefined,
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
    case 'ptt':
    case 'voice':
      return 'audio';
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'document':
      return 'document';
    default:
      return 'unknown';
  }
}
