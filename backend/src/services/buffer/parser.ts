import { randomUUID } from 'crypto';
import { BufferedMessagePayload, BufferedMessageType } from './smartBuffer';

export interface GatewayWebhookEnvelope {
  event?: string;
  payload?: Record<string, unknown>;
  timestamp?: number;
}

export interface ParsedIncomingMessage {
  chatId: string;
  message: BufferedMessagePayload;
}

export function parseGatewayWebhookBody(body: unknown): ParsedIncomingMessage | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const envelope = body as GatewayWebhookEnvelope;
  const messageObject = extractMessageObject(envelope);

  if (!messageObject) {
    return null;
  }

  const fromField = typeof messageObject.from === 'string' ? messageObject.from : undefined;
  const chatField =
    typeof messageObject.chatId === 'string' ? messageObject.chatId : undefined;

  const chatId = chatField ?? fromField;

  if (!chatId) {
    return null;
  }

  const type = mapMessageType(typeof messageObject.type === 'string' ? messageObject.type : undefined);

  const timestampValue =
    typeof messageObject.timestamp === 'number'
      ? messageObject.timestamp
      : typeof messageObject.timestamp === 'string'
        ? Number(messageObject.timestamp)
        : typeof envelope.timestamp === 'number'
          ? envelope.timestamp
          : null;

  const receivedAtMs =
    timestampValue && !Number.isNaN(timestampValue) ? timestampValue * 1000 : Date.now();

  const textBody =
    typeof messageObject.body === 'string'
      ? messageObject.body
      : typeof messageObject.text === 'string'
        ? messageObject.text
        : typeof messageObject.caption === 'string'
          ? messageObject.caption
          : undefined;

  const message: BufferedMessagePayload = {
    id:
      (typeof messageObject.id === 'string' ? messageObject.id : undefined) ??
      (typeof messageObject.messageId === 'string' ? messageObject.messageId : undefined) ??
      randomUUID(),
    type,
    text: textBody,
    audioUrl: typeof messageObject.audioUrl === 'string' ? messageObject.audioUrl : undefined,
    imageUrl: typeof messageObject.imageUrl === 'string' ? messageObject.imageUrl : undefined,
    videoUrl: typeof messageObject.videoUrl === 'string' ? messageObject.videoUrl : undefined,
    documentUrl:
      typeof messageObject.documentUrl === 'string' ? messageObject.documentUrl : undefined,
    mimeType: typeof messageObject.mimetype === 'string' ? messageObject.mimetype : undefined,
    caption: typeof messageObject.caption === 'string' ? messageObject.caption : undefined,
    raw: messageObject,
    receivedAt: new Date(receivedAtMs).toISOString()
  };

  return { chatId, message };
}

function extractMessageObject(envelope: GatewayWebhookEnvelope): Record<string, unknown> | null {
  if (!envelope.event || typeof envelope.event !== 'string') {
    return null;
  }

  if (envelope.event.startsWith('message') && envelope.payload && typeof envelope.payload === 'object') {
    return envelope.payload;
  }

  return null;
}

function mapMessageType(type?: string): BufferedMessageType {
  if (!type) {
    return 'unknown';
  }

  switch (type.toLowerCase()) {
    case 'chat':
    case 'conversation':
    case 'extendedtextmessage':
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
