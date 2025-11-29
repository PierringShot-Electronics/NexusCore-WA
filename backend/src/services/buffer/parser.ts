import { randomUUID } from 'crypto';
import { BufferedMessagePayload, BufferedMessageType } from './smartBuffer';

export interface WahaWebhookRequest {
  event?: string;
  payload?: Record<string, unknown>;
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
  const messageObject = extractMessageObject(payload);

  if (!messageObject) {
    return null;
  }

  const chatId =
    (typeof messageObject.from === 'string' && messageObject.from) ||
    (typeof messageObject.chatId === 'string' && messageObject.chatId);

  if (!chatId) {
    return null;
  }

  const type = mapMessageType(
    typeof messageObject.type === 'string'
      ? messageObject.type
      : typeof messageObject._data === 'object' &&
          messageObject._data !== null &&
          typeof (messageObject._data as Record<string, unknown>).type ===
            'string'
        ? String((messageObject._data as Record<string, unknown>).type)
        : undefined
  );

  const timestampValue =
    typeof messageObject.timestamp === 'number'
      ? messageObject.timestamp
      : typeof messageObject.timestamp === 'string'
        ? Number(messageObject.timestamp)
        : null;

  let receivedAtMs: number;
  if (timestampValue && !Number.isNaN(timestampValue)) {
    receivedAtMs = timestampValue * 1000;
  } else {
    receivedAtMs = Date.now();
  }

  const message: BufferedMessagePayload = {
    id:
      (typeof messageObject.id === 'string' && messageObject.id) ??
      (typeof messageObject._data === 'object' &&
      messageObject._data !== null &&
      typeof (messageObject._data as Record<string, any>).id === 'object' &&
      (messageObject._data as Record<string, any>).id
        ? String(
            (messageObject._data as Record<string, any>).id._serialized ??
              (messageObject._data as Record<string, any>).id.id ??
              ''
          )
        : undefined) ??
      randomUUID(),
    type,
    text:
      (typeof messageObject.text?.body === 'string' && messageObject.text.body) ??
      (typeof messageObject.body === 'string' && messageObject.body),
    audioUrl:
      messageObject.audio?.url ??
      messageObject.voice?.url ??
      (typeof messageObject.audioUrl === 'string'
        ? messageObject.audioUrl
        : undefined),
    imageUrl:
      messageObject.image?.url ??
      (typeof messageObject.imageUrl === 'string'
        ? messageObject.imageUrl
        : undefined),
    videoUrl:
      messageObject.video?.url ??
      (typeof messageObject.videoUrl === 'string'
        ? messageObject.videoUrl
        : undefined),
    documentUrl:
      messageObject.document?.url ??
      (typeof messageObject.documentUrl === 'string'
        ? messageObject.documentUrl
        : undefined),
    mimeType:
      messageObject.audio?.mime_type ??
      messageObject.voice?.mime_type ??
      messageObject.image?.mime_type ??
      messageObject.video?.mime_type ??
      messageObject.document?.mime_type,
    caption:
      typeof messageObject.caption === 'string'
        ? messageObject.caption
        : undefined,
    raw: messageObject,
    receivedAt: new Date(receivedAtMs).toISOString()
  };

  return { chatId, message };
}

function extractMessageObject(payload: WahaWebhookRequest): any | null {
  if (Array.isArray(payload.messages) && payload.messages.length > 0) {
    return payload.messages[0];
  }

  if (
    payload.event &&
    payload.event.startsWith('message') &&
    payload.payload &&
    typeof payload.payload === 'object'
  ) {
    return payload.payload;
  }

  return null;
}

function mapMessageType(type?: string): BufferedMessageType {
  if (!type) {
    return 'unknown';
  }

  switch (type) {
    case 'chat':
    case 'conversation':
    case 'extendedTextMessage':
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
