"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiRouter = createApiRouter;
const crypto_1 = require("crypto");
const express_1 = require("express");
const env_1 = require("../config/env");
const client_1 = require("../wweb/client");
const logger_1 = require("../logger");
const labelStore = new Map();
const presenceStore = new Map();
const getLabelMap = (session) => {
    let labels = labelStore.get(session);
    if (!labels) {
        labels = new Map();
        labelStore.set(session, labels);
    }
    return labels;
};
const getPresenceMap = (session) => {
    let presences = presenceStore.get(session);
    if (!presences) {
        presences = new Map();
        presenceStore.set(session, presences);
    }
    return presences;
};
const resolveSessionName = (params) => params.session ?? env_1.env.SESSION_NAME;
const serializePresence = (record) => ({
    chatId: record.chatId,
    status: record.status,
    lastSeen: record.lastSeen ?? null,
    subscribed: record.subscribed,
    updatedAt: record.updatedAt
});
function createApiRouter() {
    const router = (0, express_1.Router)();
    const ensureSessionMatch = (session, response) => {
        if (session && session !== env_1.env.SESSION_NAME) {
            response.status(404).json({ error: 'session_not_found' });
            return false;
        }
        return true;
    };
    const requireReady = (response) => {
        if (!client_1.wwebGateway.isReady()) {
            response.status(503).json({ error: 'session_not_ready' });
            return false;
        }
        return true;
    };
    const serializeContact = (contact) => {
        const raw = contact;
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
    const extractFileDescriptor = (body) => {
        const file = (body?.file ?? body?.media ?? null);
        const url = typeof file?.url === 'string' ? file.url : undefined;
        const filename = typeof file?.filename === 'string' ? file.filename : undefined;
        const base64 = typeof file?.base64 === 'string' ? file.base64 : undefined;
        const mimeType = typeof file?.mimetype === 'string' ? file.mimetype : undefined;
        return { url, filename, base64, mimeType };
    };
    const serializeChat = (chat) => {
        const raw = chat;
        const lastMessage = raw.lastMessage;
        return {
            id: raw.id?._serialized ?? raw.id,
            name: raw.name,
            isGroup: raw.isGroup,
            isReadOnly: raw.isReadOnly,
            archived: raw.archived,
            unreadCount: raw.unreadCount ?? 0,
            lastMessage: lastMessage
                ? {
                    id: (lastMessage.id?._serialized ??
                        lastMessage.id?.id ??
                        (typeof lastMessage.id === 'string' ? lastMessage.id : null)),
                    timestamp: lastMessage.timestamp,
                    type: lastMessage.type,
                    body: lastMessage.body
                }
                : null
        };
    };
    const serializeMessage = (message) => {
        const raw = message;
        return {
            id: (raw.id?._serialized ??
                raw.id?.id ??
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
            session: env_1.env.SESSION_NAME
        });
    });
    router.post('/sessions', (request, response) => {
        const { id, config } = request.body ?? {};
        if (id && id !== env_1.env.SESSION_NAME) {
            return response.status(400).json({ error: 'unsupported_session' });
        }
        if (config?.webhooks) {
            client_1.wwebGateway.updateWebhooks(config.webhooks);
        }
        response.status(201).json({
            id: env_1.env.SESSION_NAME,
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
            client_1.wwebGateway.updateWebhooks(config.webhooks);
        }
        response.status(200).json(client_1.wwebGateway.getSessionDetails());
    });
    router.get('/server/version', (_request, response) => {
        response.json({
            version: 'wwebjs-bridge-0.1.0'
        });
    });
    router.get('/sessions', (_request, response) => {
        response.json([client_1.wwebGateway.getSessionDetails()]);
    });
    router.get('/sessions/:session', (request, response) => {
        const { session } = request.params;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        response.json(client_1.wwebGateway.getSessionDetails());
    });
    router.get('/sessions/:session/me', (request, response) => {
        const { session } = request.params;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const details = client_1.wwebGateway.getSessionDetails();
        response.json(details.me ?? {});
    });
    router.post('/sessions/:session/start', async (request, response) => {
        const { session } = request.params;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        try {
            await client_1.wwebGateway.start();
            response.status(201).json({ status: 'starting' });
        }
        catch (error) {
            logger_1.logger.error({ err: error }, 'Failed to start session via API');
            response.status(500).json({ error: 'session_start_failed' });
        }
    });
    router.post('/sessions/:session/stop', async (request, response) => {
        const { session } = request.params;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        try {
            await client_1.wwebGateway.stop();
            response.status(201).json({ status: 'stopped' });
        }
        catch (error) {
            logger_1.logger.error({ err: error }, 'Failed to stop session via API');
            response.status(500).json({ error: 'session_stop_failed' });
        }
    });
    router.get('/:session/auth/qr', async (request, response) => {
        const { session } = request.params;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        try {
            const qr = await client_1.wwebGateway.getQrDataUrl();
            if (!qr) {
                return response.status(422).json({ error: 'qr_pending' });
            }
            response.json({ qr });
        }
        catch (error) {
            logger_1.logger.error({ err: error }, 'Failed to fetch QR');
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
            const id = await client_1.wwebGateway.sendText(chatId, text, {
                linkPreview: Boolean(linkPreview)
            });
            response.status(201).json({
                id
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to send text message');
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
            await client_1.wwebGateway.sendSeen(chatId);
            response.status(201).json({ status: 'seen' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to send seen receipts');
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
            await client_1.wwebGateway.setTyping(chatId, true);
            response.status(201).json({ status: 'typing' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to start typing indicator');
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
            await client_1.wwebGateway.setTyping(chatId, false);
            response.status(201).json({ status: 'idle' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to stop typing indicator');
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
            const id = await client_1.wwebGateway.sendText(chatId, text, { linkPreview: true });
            response.status(201).json({ id });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to send link preview');
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
                ? await client_1.wwebGateway.sendMediaFromBase64(chatId, file.base64, {
                    caption: typeof caption === 'string' ? caption : undefined,
                    fileName: file.filename,
                    mimeType: file.mimeType
                })
                : await client_1.wwebGateway.sendMediaFromUrl(chatId, file.url, {
                    caption: typeof caption === 'string' ? caption : undefined,
                    fileName: file.filename,
                    mimeType: file.mimeType
                });
            response.status(201).json({ id });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId, file }, 'Failed to send image');
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
                ? await client_1.wwebGateway.sendMediaFromBase64(chatId, file.base64, {
                    asVoice: true,
                    fileName: file.filename,
                    mimeType: file.mimeType ?? 'audio/ogg; codecs=opus'
                })
                : await client_1.wwebGateway.sendMediaFromUrl(chatId, file.url, {
                    asVoice: true,
                    fileName: file.filename,
                    mimeType: file.mimeType ?? 'audio/ogg; codecs=opus'
                });
            response.status(201).json({ id });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId, file }, 'Failed to send voice note');
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
                ? await client_1.wwebGateway.sendMediaFromBase64(chatId, file.base64, {
                    caption: typeof caption === 'string' ? caption : undefined,
                    fileName: file.filename,
                    mimeType: file.mimeType
                })
                : await client_1.wwebGateway.sendMediaFromUrl(chatId, file.url, {
                    caption: typeof caption === 'string' ? caption : undefined,
                    fileName: file.filename,
                    mimeType: file.mimeType
                });
            response.status(201).json({ id });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId, file }, 'Failed to send video');
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
                ? await client_1.wwebGateway.sendMediaFromBase64(chatId, file.base64, {
                    caption,
                    asDocument: true,
                    fileName: file.filename,
                    mimeType: file.mimeType
                })
                : await client_1.wwebGateway.sendMediaFromUrl(chatId, file.url, {
                    caption,
                    asDocument: true,
                    fileName: file.filename,
                    mimeType: file.mimeType
                });
            response.status(201).json({ id });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId, file }, 'Failed to send file');
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
            await client_1.wwebGateway.sendLocation(chatId, latitude, longitude, typeof title === 'string' ? title : undefined);
            response.status(201).json({ status: 'location_sent' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to send location');
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
            ? request.body?.contacts
            : [];
        const card = contacts.find((entry) => typeof entry?.vcard === 'string' && entry.vcard.length > 0);
        if (!card) {
            return response.status(400).json({ error: 'vcard_required' });
        }
        try {
            await client_1.wwebGateway.sendVcard(chatId, card.vcard);
            response.status(201).json({ status: 'contact_sent' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, chatId }, 'Failed to send vcard');
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
            await client_1.wwebGateway.sendReaction(messageId, reaction);
            response.status(200).json({ status: 'reacted' });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, messageId }, 'Failed to send reaction');
            response.status(500).json({ error: 'reaction_failed' });
        }
    });
    router.get('/contacts', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const contacts = await client_1.wwebGateway.getContacts();
        response.json(contacts.map(serializeContact));
    });
    router.get('/contacts/all', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const contacts = await client_1.wwebGateway.getContacts();
        response.json(contacts.map(serializeContact));
    });
    router.get('/contacts/check-exists', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const phone = typeof request.query.phone === 'string' ? request.query.phone : undefined;
        if (!phone) {
            return response.status(400).json({ error: 'phone_required' });
        }
        try {
            const exists = await client_1.wwebGateway.checkNumberRegistration(phone);
            response.json({ exists });
        }
        catch (error) {
            logger_1.logger.error({ err: error, phone }, 'Failed to check number registration');
            response.status(500).json({ error: 'check_failed' });
        }
    });
    router.get('/contacts/about', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const contactId = typeof request.query.contactId === 'string' ? request.query.contactId : undefined;
        if (!contactId) {
            return response.status(400).json({ error: 'contactId_required' });
        }
        const about = await client_1.wwebGateway.getContactAbout(contactId);
        if (!about) {
            return response.status(204).send();
        }
        response.json({ about });
    });
    router.get('/contacts/profile-picture', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const contactId = typeof request.query.contactId === 'string' ? request.query.contactId : undefined;
        if (!contactId) {
            return response.status(400).json({ error: 'contactId_required' });
        }
        const url = await client_1.wwebGateway.getContactProfilePicture(contactId);
        if (!url) {
            return response.status(204).send();
        }
        response.json({ url });
    });
    router.get('/contacts/:contactId', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const { contactId } = request.params;
        const contact = await client_1.wwebGateway.getContact(contactId);
        if (!contact) {
            return response.status(404).json({ error: 'contact_not_found' });
        }
        response.json(serializeContact(contact));
    });
    router.get('/chats', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
        if (!ensureSessionMatch(session, response)) {
            return;
        }
        const chats = await client_1.wwebGateway.getChats();
        response.json(chats.map(serializeChat));
    });
    router.get('/messages/:messageId/media', async (request, response) => {
        const session = typeof request.query.session === 'string' ? request.query.session : undefined;
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
            const media = await client_1.wwebGateway.getMessageMedia(messageId);
            if (!media) {
                return response.status(404).json({ error: 'media_not_found' });
            }
            const download = typeof request.query.download === 'string' && request.query.download === '1';
            response.setHeader('Content-Type', media.mimetype);
            response.setHeader('Content-Length', String(media.data.length));
            response.setHeader('Cache-Control', 'private, max-age=300');
            response.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="${encodeURIComponent(media.filename)}"`);
            return response.send(media.data);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                return response.status(503).json({ error: 'session_not_ready' });
            }
            logger_1.logger.error({ err: error, messageId }, 'Failed to stream message media');
            return response.status(500).json({ error: 'media_stream_failed' });
        }
    });
    const sessionRouter = (0, express_1.Router)({ mergeParams: true });
    sessionRouter.use((request, response, next) => {
        if (!ensureSessionMatch(request.params.session, response)) {
            return;
        }
        next();
    });
    sessionRouter.get('/profile', (_request, response) => {
        const details = client_1.wwebGateway.getSessionDetails();
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
        const chats = await client_1.wwebGateway.getChats();
        response.json(chats.map(serializeChat));
    });
    sessionRouter.get('/chats/overview', async (_request, response) => {
        const chats = await client_1.wwebGateway.getChats();
        response.json({
            chats: chats.map(serializeChat)
        });
    });
    sessionRouter.get('/chats/:chatId', async (request, response) => {
        const { chatId } = request.params;
        const chat = await client_1.wwebGateway.getChat(chatId);
        if (!chat) {
            return response.status(404).json({ error: 'chat_not_found' });
        }
        response.json(serializeChat(chat));
    });
    sessionRouter.get('/chats/:chatId/messages', async (request, response) => {
        const { chatId } = request.params;
        const limitParam = request.query.limit;
        const limit = typeof limitParam === 'string' && !Number.isNaN(Number(limitParam))
            ? Number(limitParam)
            : 20;
        const messages = await client_1.wwebGateway.getChatMessages(chatId, limit);
        response.json(messages.map(serializeMessage));
    });
    sessionRouter.get('/contacts/:chatId', async (request, response) => {
        const { chatId } = request.params;
        const contact = await client_1.wwebGateway.getContact(chatId);
        if (contact) {
            return response.json(serializeContact(contact));
        }
        response.json({
            id: chatId
        });
    });
    sessionRouter.get('/labels', (request, response) => {
        const sessionName = resolveSessionName(request.params);
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
        const sessionName = resolveSessionName(request.params);
        const { name, colorHex } = request.body ?? {};
        if (typeof name !== 'string' || name.trim().length === 0) {
            return response.status(400).json({ error: 'label_name_required' });
        }
        const labels = getLabelMap(sessionName);
        const id = (0, crypto_1.randomUUID)();
        const record = {
            id,
            name: name.trim(),
            colorHex: typeof colorHex === 'string' ? colorHex : undefined,
            createdAt: new Date().toISOString(),
            chats: new Set()
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
        const sessionName = resolveSessionName(request.params);
        const { chatId } = request.params;
        if (!chatId || typeof chatId !== 'string') {
            return response.status(400).json({ error: 'chatId_required' });
        }
        const labels = getLabelMap(sessionName);
        const labelEntries = Array.isArray(request.body?.labels) ? request.body.labels : [];
        if (!Array.isArray(labelEntries) || labelEntries.length === 0) {
            return response.status(400).json({ error: 'labels_required' });
        }
        const applied = [];
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
        const sessionName = resolveSessionName(request.params);
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
        const sessionName = resolveSessionName(request.params);
        const presences = getPresenceMap(sessionName);
        response.json(Array.from(presences.values()).map(serializePresence));
    });
    sessionRouter.get('/presence/:chatId', (request, response) => {
        const sessionName = resolveSessionName(request.params);
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
        const sessionName = resolveSessionName(request.params);
        const { chatId } = request.params;
        const presences = getPresenceMap(sessionName);
        const record = presences.get(chatId) ??
            {
                chatId,
                status: 'unknown',
                lastSeen: null,
                subscribed: false,
                updatedAt: new Date().toISOString()
            };
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
