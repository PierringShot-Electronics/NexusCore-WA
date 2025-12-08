import { randomUUID } from 'crypto';
import { Router, type Request, type Response } from 'express';
import type { Chat, Contact, Message } from 'whatsapp-web.js';
import { env } from '../config/env';
import { wwebGateway } from '../wweb/client';
import { logger } from '../logger';

type LabelRecord = {
  id: string;
  name: string;
  colorHex?: string;
  createdAt: string;
  chats: Set<string>;
};

type PresenceRecord = {
  chatId: string;
  status: string;
  lastSeen?: string | null;
  subscribed: boolean;
  updatedAt: string;
};

const labelStore: Map<string, Map<string, LabelRecord>> = new Map();
const presenceStore: Map<string, Map<string, PresenceRecord>> = new Map();

const getLabelMap = (session: string): Map<string, LabelRecord> => {
  let labels = labelStore.get(session);
  if (!labels) {
    labels = new Map<string, LabelRecord>();
    labelStore.set(session, labels);
  }
  return labels;
};

const getPresenceMap = (session: string): Map<string, PresenceRecord> => {
  let presences = presenceStore.get(session);
  if (!presences) {
    presences = new Map<string, PresenceRecord>();
    presenceStore.set(session, presences);
  }
  return presences;
};

const resolveSessionName = (params: Record<string, string | undefined>): string =>
  params.session ?? env.SESSION_NAME;

const serializePresence = (record: PresenceRecord) => ({
  chatId: record.chatId,
  status: record.status,
  lastSeen: record.lastSeen ?? null,
  subscribed: record.subscribed,
  updatedAt: record.updatedAt
});

export function createApiRouter(): Router {
  const router = Router();
  const ensureSessionMatch = (session: string | undefined, response: Response): boolean => {
    if (session && session !== env.SESSION_NAME) {
      response.status(404).json({ error: 'session_not_found' });
      return false;
    }
    return true;
  };
  const requireReady = (response: Response): boolean => {
    if (!wwebGateway.isReady()) {
      response.status(503).json({ error: 'session_not_ready' });
      return false;
    }
    return true;
  };
  const serializeContact = (contact: Contact) => {
    const raw = contact as Contact & Record<string, any>;
    return {
      id: raw.id?._serialized ?? raw.id,
      number: raw.number,
      pushName: raw.pushname,
      name: raw.name,
      shortName: raw.shortName,
      isBusiness: raw.isBusiness,
      isEnterprise: raw.isEnterprise,
      isMe: raw.isMe,
      isMyContact: raw.isMyContact
    };
  };
  const extractFileDescriptor = (body: Record<string, unknown> | undefined) => {
    const file = (body?.file ?? body?.media ?? null) as Record<string, unknown> | null;
    const url = typeof file?.url === 'string' ? (file.url as string) : undefined;
    const filename = typeof file?.filename === 'string' ? (file.filename as string) : undefined;
    const base64 = typeof file?.base64 === 'string' ? (file.base64 as string) : undefined;
    const mimeType = typeof file?.mimetype === 'string' ? (file.mimetype as string) : undefined;
    return { url, filename, base64, mimeType };
  };
  const serializeChat = (chat: Chat) => {
    const raw = chat as Chat & Record<string, any>;
    const lastMessage: Message | undefined = raw.lastMessage;
    return {
      id: raw.id?._serialized ?? raw.id,
      name: raw.name,
      isGroup: raw.isGroup,
      isReadOnly: raw.isReadOnly,
      archived: raw.archived,
      unreadCount: raw.unreadCount ?? 0,
      lastMessage: lastMessage
        ? {
            id:
              ((lastMessage.id as { _serialized?: string })?._serialized ??
                (lastMessage.id as { id?: string })?.id ??
                (typeof lastMessage.id === 'string' ? lastMessage.id : null)),
            timestamp: lastMessage.timestamp,
            type: lastMessage.type,
            body: lastMessage.body
          }
        : null
    };
  };
  const serializeMessage = (message: Message) => {
    const raw = message as Message & Record<string, any>;
    return {
      id:
        ((raw.id as { _serialized?: string })?._serialized ??
          (raw.id as { id?: string })?.id ??
          (typeof raw.id === 'string' ? raw.id : null)),
      type: raw.type,
      body: raw.body,
      from: raw.from,
      to: raw.to,
      fromMe: raw.fromMe,
      timestamp: raw.timestamp,
      hasMedia: raw.hasMedia
    };
  };

  router.get('/server/status', (_request, response) => {
    response.json({
      status: 'ok',
      engine: 'wwebjs',
      session: env.SESSION_NAME
    });
  });

  router.post('/sessions', (request, response) => {
    const { id, config } = request.body ?? {};
    if (id && id !== env.SESSION_NAME) {
      return response.status(400).json({ error: 'unsupported_session' });
    }
    if (config?.webhooks) {
      wwebGateway.updateWebhooks(config.webhooks);
    }
    response.status(201).json({
      id: env.SESSION_NAME,
      status: 'created'
    });
  });

  router.put('/sessions/:session', (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const { config } = request.body ?? {};
    if (config?.webhooks) {
      wwebGateway.updateWebhooks(config.webhooks);
    }
    response.status(200).json(wwebGateway.getSessionDetails());
  });

  router.get('/server/version', (_request, response) => {
    response.json({
      version: 'wwebjs-bridge-0.1.0'
    });
  });

  router.get('/sessions', (_request, response) => {
    response.json([wwebGateway.getSessionDetails()]);
  });

  router.get('/sessions/:session', (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    response.json(wwebGateway.getSessionDetails());
  });

  router.get('/sessions/:session/me', (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const details = wwebGateway.getSessionDetails();
    response.json(details.me ?? {});
  });

  router.post('/sessions/:session/start', async (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    try {
      await wwebGateway.start();
      response.status(201).json({ status: 'starting' });
    } catch (error) {
      logger.error({ err: error }, 'Failed to start session via API');
      response.status(500).json({ error: 'session_start_failed' });
    }
  });

  router.post('/sessions/:session/stop', async (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    try {
      await wwebGateway.stop();
      response.status(201).json({ status: 'stopped' });
    } catch (error) {
      logger.error({ err: error }, 'Failed to stop session via API');
      response.status(500).json({ error: 'session_stop_failed' });
    }
  });

  router.get('/:session/auth/qr', async (request, response) => {
    const { session } = request.params;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    try {
      const qr = await wwebGateway.getQrDataUrl();
      if (!qr) {
        return response.status(422).json({ error: 'qr_pending' });
      }
      response.json({ qr });
    } catch (error) {
      logger.error({ err: error }, 'Failed to fetch QR');
      response.status(500).json({ error: 'qr_fetch_failed' });
    }
  });

  router.post('/sendText', async (request, response) => {
    const { session, chatId, text, linkPreview } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    if (!text || typeof text !== 'string') {
      return response.status(400).json({ error: 'text_required' });
    }

    try {
      const id = await wwebGateway.sendText(chatId, text, {
        linkPreview: Boolean(linkPreview)
      });
      response.status(201).json({
        id
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to send text message');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendSeen', async (request, response) => {
    const { session, chatId } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    try {
      await wwebGateway.sendSeen(chatId);
      response.status(201).json({ status: 'seen' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to send seen receipts');
      response.status(500).json({ error: 'seen_failed' });
    }
  });

  router.post('/startTyping', async (request, response) => {
    const { session, chatId } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    try {
      await wwebGateway.setTyping(chatId, true);
      response.status(201).json({ status: 'typing' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to start typing indicator');
      response.status(500).json({ error: 'typing_start_failed' });
    }
  });

  router.post('/stopTyping', async (request, response) => {
    const { session, chatId } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    try {
      await wwebGateway.setTyping(chatId, false);
      response.status(201).json({ status: 'idle' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to stop typing indicator');
      response.status(500).json({ error: 'typing_stop_failed' });
    }
  });

  router.post('/sendLinkPreview', async (request, response) => {
    const { session, chatId, text } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    if (!text || typeof text !== 'string') {
      return response.status(400).json({ error: 'text_required' });
    }
    try {
      const id = await wwebGateway.sendText(chatId, text, { linkPreview: true });
      response.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to send link preview');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendImage', async (request, response) => {
    const { session, chatId, caption } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const file = extractFileDescriptor(request.body);
    if (!file.url && !file.base64) {
      return response.status(400).json({ error: 'url_required' });
    }
    try {
      const id = file.base64
        ? await wwebGateway.sendMediaFromBase64(chatId, file.base64, {
            caption: typeof caption === 'string' ? caption : undefined,
            fileName: file.filename,
            mimeType: file.mimeType
          })
        : await wwebGateway.sendMediaFromUrl(chatId, file.url as string, {
            caption: typeof caption === 'string' ? caption : undefined,
            fileName: file.filename,
            mimeType: file.mimeType
          });
      response.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId, file }, 'Failed to send image');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendVoice', async (request, response) => {
    const { session, chatId } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const file = extractFileDescriptor(request.body);
    if (!file.url && !file.base64) {
      return response.status(400).json({ error: 'url_required' });
    }
    try {
      const id = file.base64
        ? await wwebGateway.sendMediaFromBase64(chatId, file.base64, {
            asVoice: true,
            fileName: file.filename,
            mimeType: file.mimeType ?? 'audio/ogg; codecs=opus'
          })
        : await wwebGateway.sendMediaFromUrl(chatId, file.url as string, {
            asVoice: true,
            fileName: file.filename,
            mimeType: file.mimeType ?? 'audio/ogg; codecs=opus'
          });
      response.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId, file }, 'Failed to send voice note');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendVideo', async (request, response) => {
    const { session, chatId, caption } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const file = extractFileDescriptor(request.body);
    if (!file.url && !file.base64) {
      return response.status(400).json({ error: 'url_required' });
    }
    try {
      const id = file.base64
        ? await wwebGateway.sendMediaFromBase64(chatId, file.base64, {
            caption: typeof caption === 'string' ? caption : undefined,
            fileName: file.filename,
            mimeType: file.mimeType
          })
        : await wwebGateway.sendMediaFromUrl(chatId, file.url as string, {
            caption: typeof caption === 'string' ? caption : undefined,
            fileName: file.filename,
            mimeType: file.mimeType
          });
      response.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId, file }, 'Failed to send video');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendFile', async (request, response) => {
    const { session, chatId, caption } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const file = extractFileDescriptor(request.body);
    if (!file.url && !file.base64) {
      return response.status(400).json({ error: 'url_required' });
    }
    try {
      const id = file.base64
        ? await wwebGateway.sendMediaFromBase64(chatId, file.base64, {
            caption,
            asDocument: true,
            fileName: file.filename,
            mimeType: file.mimeType
          })
        : await wwebGateway.sendMediaFromUrl(chatId, file.url as string, {
            caption,
            asDocument: true,
            fileName: file.filename,
            mimeType: file.mimeType
          });
      response.status(201).json({ id });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId, file }, 'Failed to send file');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendLocation', async (request, response) => {
    const { session, chatId, latitude, longitude, title } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return response.status(400).json({ error: 'coordinates_required' });
    }
    try {
      await wwebGateway.sendLocation(chatId, latitude, longitude, typeof title === 'string' ? title : undefined);
      response.status(201).json({ status: 'location_sent' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to send location');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.post('/sendContactVcard', async (request, response) => {
    const { session, chatId } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const contacts = Array.isArray(request.body?.contacts)
      ? (request.body?.contacts as Array<Record<string, unknown>>)
      : [];
    const card = contacts.find(
      (entry) => typeof entry?.vcard === 'string' && (entry.vcard as string).length > 0
    );
    if (!card) {
      return response.status(400).json({ error: 'vcard_required' });
    }
    try {
      await wwebGateway.sendVcard(chatId, card.vcard as string);
      response.status(201).json({ status: 'contact_sent' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, chatId }, 'Failed to send vcard');
      response.status(500).json({ error: 'send_failed' });
    }
  });

  router.put('/reaction', async (request, response) => {
    const { session, messageId, reaction } = request.body ?? {};
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!messageId || typeof messageId !== 'string') {
      return response.status(400).json({ error: 'messageId_required' });
    }
    if (!reaction || typeof reaction !== 'string') {
      return response.status(400).json({ error: 'reaction_required' });
    }
    try {
      await wwebGateway.sendReaction(messageId, reaction);
      response.status(200).json({ status: 'reacted' });
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, messageId }, 'Failed to send reaction');
      response.status(500).json({ error: 'reaction_failed' });
    }
  });

  router.get('/contacts', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const contacts = await wwebGateway.getContacts();
    response.json(contacts.map(serializeContact));
  });

  router.get('/contacts/all', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const contacts = await wwebGateway.getContacts();
    response.json(contacts.map(serializeContact));
  });

  router.get('/contacts/check-exists', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const phone = typeof request.query.phone === 'string' ? (request.query.phone as string) : undefined;
    if (!phone) {
      return response.status(400).json({ error: 'phone_required' });
    }
    try {
      const exists = await wwebGateway.checkNumberRegistration(phone);
      response.json({ exists });
    } catch (error) {
      logger.error({ err: error, phone }, 'Failed to check number registration');
      response.status(500).json({ error: 'check_failed' });
    }
  });

  router.get('/contacts/about', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const contactId =
      typeof request.query.contactId === 'string' ? (request.query.contactId as string) : undefined;
    if (!contactId) {
      return response.status(400).json({ error: 'contactId_required' });
    }
    const about = await wwebGateway.getContactAbout(contactId);
    if (!about) {
      return response.status(204).send();
    }
    response.json({ about });
  });

  router.get('/contacts/profile-picture', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const contactId =
      typeof request.query.contactId === 'string' ? (request.query.contactId as string) : undefined;
    if (!contactId) {
      return response.status(400).json({ error: 'contactId_required' });
    }
    const url = await wwebGateway.getContactProfilePicture(contactId);
    if (!url) {
      return response.status(204).send();
    }
    response.json({ url });
  });

  router.get('/contacts/:contactId', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const { contactId } = request.params;
    const contact = await wwebGateway.getContact(contactId);
    if (!contact) {
      return response.status(404).json({ error: 'contact_not_found' });
    }
    response.json(serializeContact(contact));
  });

  router.get('/chats', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    const chats = await wwebGateway.getChats();
    response.json(chats.map(serializeChat));
  });

  router.get('/messages/:messageId/media', async (request, response) => {
    const session = typeof request.query.session === 'string' ? (request.query.session as string) : undefined;
    if (!ensureSessionMatch(session, response)) {
      return;
    }
    if (!requireReady(response)) {
      return;
    }
    const { messageId } = request.params;
    if (!messageId || typeof messageId !== 'string') {
      return response.status(400).json({ error: 'messageId_required' });
    }
    try {
      const media = await wwebGateway.getMessageMedia(messageId);
      if (!media) {
        return response.status(404).json({ error: 'media_not_found' });
      }
      const download = typeof request.query.download === 'string' && request.query.download === '1';
      response.setHeader('Content-Type', media.mimetype);
      response.setHeader('Content-Length', String(media.data.length));
      response.setHeader('Cache-Control', 'private, max-age=300');
      response.setHeader(
        'Content-Disposition',
        `${download ? 'attachment' : 'inline'}; filename="${encodeURIComponent(media.filename)}"`
      );
      return response.send(media.data);
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        return response.status(503).json({ error: 'session_not_ready' });
      }
      logger.error({ err: error, messageId }, 'Failed to stream message media');
      return response.status(500).json({ error: 'media_stream_failed' });
    }
  });

  const sessionRouter = Router({ mergeParams: true });
  sessionRouter.use((request, response, next) => {
    if (!ensureSessionMatch((request.params as Record<string, string | undefined>).session, response)) {
      return;
    }
    next();
  });

  sessionRouter.get('/profile', (_request, response) => {
    const details = wwebGateway.getSessionDetails();
    response.json({
      id: details.me?.id ?? null,
      pushName: details.me?.pushName ?? null,
      status: details.status
    });
  });

  sessionRouter.get('/profile/status', (_request, response) => {
    response.status(404).json({ error: 'status_unavailable' });
  });

  sessionRouter.get('/profile/picture', (_request, response) => {
    response.status(404).json({ error: 'picture_unavailable' });
  });

  sessionRouter.get('/chats', async (_request, response) => {
    const chats = await wwebGateway.getChats();
    response.json(chats.map(serializeChat));
  });

  sessionRouter.get('/chats/overview', async (_request, response) => {
    const chats = await wwebGateway.getChats();
    response.json({
      chats: chats.map(serializeChat)
    });
  });

  sessionRouter.get('/chats/:chatId', async (request, response) => {
    const { chatId } = request.params;
    const chat = await wwebGateway.getChat(chatId);
    if (!chat) {
      return response.status(404).json({ error: 'chat_not_found' });
    }
    response.json(serializeChat(chat));
  });

  sessionRouter.get('/chats/:chatId/messages', async (request, response) => {
    const { chatId } = request.params;
    const limitParam = request.query.limit;
    const limit =
      typeof limitParam === 'string' && !Number.isNaN(Number(limitParam))
        ? Number(limitParam)
        : 20;
    const messages = await wwebGateway.getChatMessages(chatId, limit);
    response.json(messages.map(serializeMessage));
  });

  sessionRouter.get('/contacts/:chatId', async (request, response) => {
    const { chatId } = request.params;
    const contact = await wwebGateway.getContact(chatId);
    if (contact) {
      return response.json(serializeContact(contact));
    }
    response.json({
      id: chatId
    });
  });

  sessionRouter.get('/labels', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const labels = getLabelMap(sessionName);
    const payload = Array.from(labels.values()).map((record) => ({
      id: record.id,
      name: record.name,
      colorHex: record.colorHex,
      createdAt: record.createdAt,
      chatIds: Array.from(record.chats.values())
    }));
    response.json(payload);
  });

  sessionRouter.post('/labels', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const { name, colorHex } = request.body ?? {};
    if (typeof name !== 'string' || name.trim().length === 0) {
      return response.status(400).json({ error: 'label_name_required' });
    }
    const labels = getLabelMap(sessionName);
    const id = randomUUID();
    const record: LabelRecord = {
      id,
      name: name.trim(),
      colorHex: typeof colorHex === 'string' ? colorHex : undefined,
      createdAt: new Date().toISOString(),
      chats: new Set<string>()
    };
    labels.set(id, record);
    response.status(201).json({
      id: record.id,
      name: record.name,
      colorHex: record.colorHex,
      createdAt: record.createdAt
    });
  });

  sessionRouter.put('/labels/chats/:chatId', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const { chatId } = request.params;
    if (!chatId || typeof chatId !== 'string') {
      return response.status(400).json({ error: 'chatId_required' });
    }
    const labels = getLabelMap(sessionName);
    const labelEntries = Array.isArray(request.body?.labels) ? request.body.labels : [];
    if (!Array.isArray(labelEntries) || labelEntries.length === 0) {
      return response.status(400).json({ error: 'labels_required' });
    }
    const applied: string[] = [];
    for (const entry of labelEntries) {
      const id = typeof entry?.id === 'string' ? entry.id : undefined;
      if (!id) {
        return response.status(400).json({ error: 'label_id_required' });
      }
      const record = labels.get(id);
      if (!record) {
        return response.status(404).json({ error: 'label_not_found', labelId: id });
      }
      record.chats.add(chatId);
      applied.push(id);
    }
    response.json({ status: 'assigned', chatId, labels: applied });
  });

  sessionRouter.delete('/labels/:labelId', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const { labelId } = request.params;
    const labels = getLabelMap(sessionName);
    const record = labels.get(labelId);
    if (!record) {
      return response.status(404).json({ error: 'label_not_found', labelId });
    }
    labels.delete(labelId);
    response.json({ status: 'deleted', labelId });
  });

  sessionRouter.get('/groups', (_request, response) => {
    response.json([]);
  });

  sessionRouter.get('/groups/:groupId', (request, response) => {
    const { groupId } = request.params;
    response.json({
      id: groupId,
      subject: null,
      isGroup: true,
      participants: []
    });
  });

  sessionRouter.get('/groups/:groupId/participants', (_request, response) => {
    response.json([]);
  });

  sessionRouter.get('/groups/:groupId/invite-code', (_request, response) => {
    response.json({ inviteCode: null });
  });

  sessionRouter.get('/presence', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const presences = getPresenceMap(sessionName);
    response.json(Array.from(presences.values()).map(serializePresence));
  });

  sessionRouter.get('/presence/:chatId', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const { chatId } = request.params;
    const presences = getPresenceMap(sessionName);
    let record = presences.get(chatId);
    if (!record) {
      record = {
        chatId,
        status: 'unknown',
        lastSeen: null,
        subscribed: false,
        updatedAt: new Date().toISOString()
      };
      presences.set(chatId, record);
    }
    response.json(serializePresence(record));
  });

  sessionRouter.get('/presence/:chatId/subscribe', (request, response) => {
    const sessionName = resolveSessionName(request.params as Record<string, string | undefined>);
    const { chatId } = request.params;
    const presences = getPresenceMap(sessionName);
    const record =
      presences.get(chatId) ??
      ({
        chatId,
        status: 'unknown',
        lastSeen: null,
        subscribed: false,
        updatedAt: new Date().toISOString()
      } satisfies PresenceRecord);
    record.subscribed = true;
    record.status = 'subscribed';
    record.updatedAt = new Date().toISOString();
    presences.set(chatId, record);
    response.status(202).json({
      status: 'subscription_started',
      chatId,
      presence: serializePresence(record)
    });
  });

  router.use('/:session', sessionRouter);

  return router;
}
