"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wwebGateway = exports.WwebGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const qrcode_1 = __importDefault(require("qrcode"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const env_1 = require("../config/env");
const logger_1 = require("../logger");
class WwebGateway {
    constructor() {
        this.client = null;
        this.sessionState = 'INITIALIZING';
        this.lastQrDataUrl = null;
        this.me = undefined;
        this.webhooks = [
            {
                url: env_1.env.WEBHOOK_URL,
                events: env_1.env.WEBHOOK_EVENTS
            }
        ];
    }
    async start() {
        if (this.client) {
            return;
        }
        const authDataPath = env_1.env.DATA_DIR;
        try {
            (0, fs_1.mkdirSync)(authDataPath, { recursive: true });
        }
        catch (error) {
            logger_1.logger.warn({ err: error, authDataPath }, 'Failed to ensure auth data directory');
        }
        const authStrategy = new whatsapp_web_js_1.LocalAuth({
            clientId: env_1.env.SESSION_NAME,
            dataPath: authDataPath
        });
        this.client = new whatsapp_web_js_1.Client({
            authStrategy,
            puppeteer: {
                headless: env_1.env.HEADLESS,
                executablePath: env_1.env.CHROME_EXECUTABLE || undefined,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ]
            }
        });
        this.registerClientEvents(this.client);
        try {
            await this.client.initialize();
            logger_1.logger.info('WWeb.js client initialised');
        }
        catch (error) {
            logger_1.logger.error({ err: error }, 'Failed to initialise WWeb.js client');
            this.sessionState = 'FAILED';
            throw error;
        }
    }
    async stop() {
        if (!this.client) {
            return;
        }
        try {
            await this.client.destroy();
        }
        catch (error) {
            logger_1.logger.warn({ err: error }, 'Error while destroying WWeb.js client');
        }
        finally {
            this.client = null;
            this.sessionState = 'DISCONNECTED';
        }
    }
    getStatus() {
        return {
            name: env_1.env.SESSION_NAME,
            status: this.sessionState,
            me: this.me
        };
    }
    isReady() {
        return this.sessionState === 'WORKING';
    }
    requireClient() {
        if (!this.client || !this.isReady()) {
            throw new Error('session_not_ready');
        }
        return this.client;
    }
    getSessionDetails() {
        return {
            ...this.getStatus(),
            config: {
                webhooks: this.webhooks
            }
        };
    }
    updateWebhooks(webhooks) {
        const normalized = webhooks
            .filter((entry) => typeof entry?.url === 'string' && entry.url.length > 0)
            .map((entry) => ({
            url: entry.url,
            events: Array.isArray(entry.events) && entry.events.length > 0
                ? entry.events
                : env_1.env.WEBHOOK_EVENTS
        }));
        this.webhooks = normalized.length > 0 ? normalized : this.webhooks;
        logger_1.logger.info({ webhooks: this.webhooks }, 'Updated gateway webhook configuration');
    }
    async getQrDataUrl() {
        return this.lastQrDataUrl;
    }
    async sendText(chatId, text, options = {}) {
        const client = this.requireClient();
        if (!text.trim()) {
            return '';
        }
        const message = await client.sendMessage(chatId, text, {
            linkPreview: options.linkPreview ?? false
        });
        return this.extractMessageId(message);
    }
    async sendMediaFromUrl(chatId, url, options = {}) {
        let download;
        try {
            download = await whatsapp_web_js_1.MessageMedia.fromUrl(url, {
                unsafeMime: true,
                filename: options.fileName
            });
        }
        catch (error) {
            if (options.asVoice) {
                download = await this.fetchMediaFromUrl(url, options.fileName, 'audio/ogg; codecs=opus');
            }
            else {
                throw error;
            }
        }
        if (options.mimeType) {
            download.mimetype = options.mimeType;
        }
        return this.dispatchMedia(chatId, download, options);
    }
    async sendMediaFromBase64(chatId, base64, options = {}) {
        const media = new whatsapp_web_js_1.MessageMedia(options.mimeType || 'application/octet-stream', base64, options.fileName || undefined);
        return this.dispatchMedia(chatId, media, options);
    }
    async sendLocation(chatId, latitude, longitude, name) {
        const client = this.requireClient();
        const description = name ?? '';
        const locationPayload = {
            latitude,
            longitude,
            description: description || undefined,
            name: description || undefined,
            address: description || undefined,
            url: undefined
        };
        await client.sendMessage(chatId, description || ' ', { location: locationPayload });
    }
    async sendVcard(chatId, vcard) {
        const client = this.requireClient();
        const sanitized = vcard.trim().replace(/^"+|"+$/g, '');
        const normalized = sanitized.replace(/\\n/g, '\n');
        await client.sendMessage(chatId, normalized, { parseVCards: true });
    }
    async fetchMediaFromUrl(url, fileName, forcedMime) {
        const response = await axios_1.default.get(url, {
            responseType: 'arraybuffer',
            timeout: 20000
        });
        const buffer = Buffer.from(response.data);
        const contentTypeHeader = response.headers['content-type'];
        const mime = forcedMime ||
            (typeof contentTypeHeader === 'string' && contentTypeHeader.length > 0
                ? contentTypeHeader
                : 'application/octet-stream');
        const resolvedFilename = this.resolveFileName(url, fileName, mime);
        return new whatsapp_web_js_1.MessageMedia(mime, buffer.toString('base64'), resolvedFilename, buffer.byteLength);
    }
    resolveFileName(url, provided, mime) {
        if (provided && provided.length > 0) {
            return provided;
        }
        try {
            const parsed = new URL(url);
            const candidate = parsed.pathname.split('/').filter(Boolean).pop();
            if (candidate) {
                return candidate;
            }
        }
        catch {
            // ignore URL parsing issues, fall through to mime-based defaults
        }
        if (mime.startsWith('audio/ogg')) {
            return 'voice-note.ogg';
        }
        if (mime.startsWith('video/')) {
            return `video.${mime.split('/')[1] ?? 'mp4'}`;
        }
        if (mime.startsWith('image/')) {
            return `image.${mime.split('/')[1] ?? 'jpg'}`;
        }
        return 'attachment';
    }
    async dispatchMedia(chatId, media, options) {
        const client = this.requireClient();
        if (!media.filename && options.fileName) {
            media.filename = options.fileName;
        }
        if (options.asVoice) {
            media.mimetype = options.mimeType ?? 'audio/ogg; codecs=opus';
            if (!media.filename) {
                media.filename = 'voice-note.ogg';
            }
        }
        else if (options.mimeType) {
            media.mimetype = options.mimeType;
        }
        const sendOptions = {
            caption: options.caption,
            sendAudioAsVoice: Boolean(options.asVoice),
            sendMediaAsDocument: Boolean(options.asDocument),
            filename: media.filename
        };
        if (options.asVoice) {
            sendOptions.ptt = true;
        }
        const message = await client.sendMessage(chatId, media, sendOptions);
        return this.extractMessageId(message);
    }
    async getMessageMedia(messageId) {
        const client = this.requireClient();
        try {
            const message = await client.getMessageById(messageId);
            if (!message || !message.hasMedia) {
                return null;
            }
            const media = await message.downloadMedia();
            if (!media || typeof media.data !== 'string' || media.data.length === 0) {
                return null;
            }
            const buffer = Buffer.from(media.data, 'base64');
            const mimetype = typeof media.mimetype === 'string' && media.mimetype.length > 0
                ? media.mimetype
                : 'application/octet-stream';
            const filenameCandidate = typeof media.filename === 'string' && media.filename.length > 0
                ? media.filename
                : undefined;
            const fallbackName = this.buildDefaultFilename(messageId, mimetype);
            const filename = this.sanitizeFilename(filenameCandidate ?? fallbackName);
            return {
                data: buffer,
                mimetype,
                filename
            };
        }
        catch (error) {
            if (error instanceof Error && error.message === 'session_not_ready') {
                throw error;
            }
            logger_1.logger.error({ err: error, messageId }, 'Failed to download message media');
            throw error;
        }
    }
    async sendReaction(messageId, emoji) {
        const client = this.requireClient();
        try {
            const message = await client.getMessageById(messageId);
            if (!message) {
                throw new Error('message_not_found');
            }
            await message.react(emoji);
        }
        catch (error) {
            logger_1.logger.error({ err: error, messageId }, 'Failed to send reaction');
            throw error;
        }
    }
    async getChat(chatId) {
        if (!this.client) {
            return null;
        }
        try {
            return await this.client.getChatById(chatId);
        }
        catch (error) {
            logger_1.logger.warn({ err: error, chatId }, 'Failed to fetch chat by id');
            return null;
        }
    }
    async getChats() {
        if (!this.client) {
            return [];
        }
        try {
            return await this.client.getChats();
        }
        catch (error) {
            logger_1.logger.warn({ err: error }, 'Failed to fetch chats');
            return [];
        }
    }
    async getContacts() {
        if (!this.client) {
            return [];
        }
        try {
            return await this.client.getContacts();
        }
        catch (error) {
            logger_1.logger.warn({ err: error }, 'Failed to fetch contacts');
            return [];
        }
    }
    async checkNumberRegistration(phone) {
        if (!this.client) {
            throw new Error('WWeb.js client not initialised');
        }
        try {
            return await this.client.isRegisteredUser(phone);
        }
        catch (error) {
            logger_1.logger.warn({ err: error, phone }, 'Failed to check number registration');
            return false;
        }
    }
    async getContactAbout(contactId) {
        const contact = await this.getContact(contactId);
        if (!contact) {
            return null;
        }
        try {
            return (await contact.getAbout()) ?? null;
        }
        catch (error) {
            logger_1.logger.warn({ err: error, contactId }, 'Failed to fetch contact about');
            return null;
        }
    }
    async getContactProfilePicture(contactId) {
        const contact = await this.getContact(contactId);
        if (!contact) {
            return null;
        }
        try {
            return (await contact.getProfilePicUrl()) ?? null;
        }
        catch (error) {
            logger_1.logger.warn({ err: error, contactId }, 'Failed to fetch profile picture');
            return null;
        }
    }
    async sendSeen(chatId) {
        const client = this.requireClient();
        await client.sendSeen(chatId);
    }
    async setTyping(chatId, typing) {
        this.requireClient();
        const chat = await this.getChat(chatId);
        if (!chat) {
            throw new Error('chat_not_found');
        }
        if (typing) {
            await chat.sendStateTyping();
        }
        else {
            await chat.clearState();
        }
    }
    async getChatMessages(chatId, limit = 20) {
        if (!this.isReady()) {
            return [];
        }
        const chat = await this.getChat(chatId);
        if (!chat) {
            return [];
        }
        try {
            return await chat.fetchMessages({ limit });
        }
        catch (error) {
            logger_1.logger.warn({ err: error, chatId }, 'Failed to fetch chat messages');
            return [];
        }
    }
    extractMessageId(message) {
        const rawId = message.id?._serialized;
        if (rawId && rawId.length > 0) {
            return rawId;
        }
        const nested = message.id.id;
        if (nested && nested.length > 0) {
            return nested;
        }
        return typeof message.id === 'string' ? message.id : '';
    }
    buildMediaUrlWithSession(path) {
        try {
            const baseUrl = new URL(env_1.env.MEDIA_HOST_URL);
            const normalizedPath = path.startsWith('/') ? path : `/${path}`;
            const url = new URL(normalizedPath, baseUrl);
            url.searchParams.set('session', env_1.env.SESSION_NAME);
            return url.toString();
        }
        catch {
            const separator = path.includes('?') ? '&' : '?';
            return `${path}${separator}session=${encodeURIComponent(env_1.env.SESSION_NAME)}`;
        }
    }
    sanitizeFilename(name) {
        const cleaned = name.replace(/[\r\n\t"]/g, '').replace(/[/\\?%*:|<>]/g, '-').trim();
        return cleaned.length > 0 ? cleaned : 'attachment';
    }
    buildDefaultFilename(messageId, mimetype) {
        const sanitizedId = messageId.replace(/[^a-zA-Z0-9_-]+/g, '');
        const extension = this.inferExtensionFromMime(mimetype);
        const base = sanitizedId.length > 0 ? sanitizedId : 'attachment';
        return extension ? `${base}.${extension}` : base;
    }
    inferExtensionFromMime(mimetype) {
        if (!mimetype || typeof mimetype !== 'string') {
            return '';
        }
        const [, subtypeRaw] = mimetype.split('/');
        if (!subtypeRaw) {
            return '';
        }
        const subtype = subtypeRaw.split(';')[0]?.trim();
        if (!subtype) {
            return '';
        }
        if (subtype === 'jpeg') {
            return 'jpg';
        }
        return subtype;
    }
    async getContact(contactId) {
        if (!this.client) {
            return null;
        }
        try {
            return await this.client.getContactById(contactId);
        }
        catch (error) {
            logger_1.logger.warn({ err: error, contactId }, 'Failed to fetch contact');
            return null;
        }
    }
    registerClientEvents(client) {
        client.on('loading_screen', (percent, message) => {
            logger_1.logger.debug({ percent, message }, 'WWeb.js loading');
            this.sessionState = 'CONNECTING';
        });
        client.on('qr', async (qr) => {
            this.sessionState = 'SCAN_QR_CODE';
            try {
                this.lastQrDataUrl = await qrcode_1.default.toDataURL(qr, { errorCorrectionLevel: 'M' });
                qrcode_terminal_1.default.generate(qr, { small: true });
            }
            catch (error) {
                logger_1.logger.error({ err: error }, 'Failed to encode QR code');
            }
        });
        client.on('authenticated', (session) => {
            logger_1.logger.info({ sessionKeys: Object.keys(session || {}) }, 'WWeb.js authenticated');
            this.sessionState = 'CONNECTING';
        });
        client.on('auth_failure', (message) => {
            logger_1.logger.error({ message }, 'WWeb.js authentication failure');
            this.sessionState = 'FAILED';
        });
        client.on('ready', async () => {
            logger_1.logger.info('WWeb.js client ready');
            this.sessionState = 'WORKING';
            try {
                const info = client.info;
                if (info?.wid?._serialized) {
                    this.me = {
                        id: info.wid._serialized,
                        pushName: info.pushname
                    };
                }
            }
            catch (error) {
                logger_1.logger.warn({ err: error }, 'Failed to read self info');
            }
        });
        client.on('disconnected', (reason) => {
            logger_1.logger.warn({ reason }, 'WWeb.js disconnected');
            this.sessionState = 'DISCONNECTED';
        });
        client.on('message', (message) => {
            void this.dispatchWebhook('message.any', this.serializeMessage(message));
        });
        client.on('message_ack', (message, ack) => {
            void this.dispatchWebhook('message.ack', {
                id: message.id?._serialized ?? message.id,
                chatId: message.from,
                ack
            });
        });
    }
    serializeMessage(message) {
        const raw = message;
        const messageId = (raw.id?._serialized ??
            raw.id?.id ??
            (typeof raw.id === 'string' ? raw.id : null)) ?? null;
        const baseMediaPath = messageId !== null ? `/api/messages/${encodeURIComponent(messageId)}/media` : null;
        const mediaUrl = raw.hasMedia && baseMediaPath ? this.buildMediaUrlWithSession(baseMediaPath) : undefined;
        const mimetype = typeof raw.mimetype === 'string'
            ? raw.mimetype
            : typeof raw.media?._data?.mimetype === 'string'
                ? raw.media._data.mimetype
                : typeof raw._data?.mimetype === 'string'
                    ? raw._data.mimetype
                    : undefined;
        const filename = typeof raw.filename === 'string'
            ? raw.filename
            : typeof raw.media?._data?.filename === 'string'
                ? raw.media._data.filename
                : typeof raw._data?.filename === 'string'
                    ? raw._data.filename
                    : undefined;
        const payload = {
            id: messageId,
            from: raw.from,
            to: raw.to,
            chatId: raw.from,
            timestamp: raw.timestamp,
            type: raw.type,
            body: raw.body,
            caption: typeof raw.caption === 'string'
                ? raw.caption
                : typeof raw._data?.caption === 'string'
                    ? raw._data.caption
                    : undefined,
            hasMedia: raw.hasMedia,
            mediaKey: raw.mediaKey,
            deviceType: raw.deviceType,
            ack: raw.ack,
            isStatus: raw.isStatus,
            isStarred: raw.isStarred,
            isForwarded: raw.isForwarded,
            mimetype,
            filename: filename ? this.sanitizeFilename(filename) : undefined
        };
        if (mediaUrl) {
            payload.mediaUrl = mediaUrl;
            switch ((raw.type ?? '').toLowerCase()) {
                case 'image':
                    payload.imageUrl = mediaUrl;
                    break;
                case 'video':
                    payload.videoUrl = mediaUrl;
                    break;
                case 'audio':
                case 'ptt':
                case 'voice':
                    payload.audioUrl = mediaUrl;
                    break;
                case 'document':
                    payload.documentUrl = mediaUrl;
                    break;
                default:
                    // leave generic mediaUrl only
                    break;
            }
        }
        return payload;
    }
    async dispatchWebhook(event, payload) {
        const envelope = {
            event,
            payload
        };
        const targets = this.webhooks.length > 0 ? this.webhooks : [{ url: env_1.env.WEBHOOK_URL, events: env_1.env.WEBHOOK_EVENTS }];
        await Promise.all(targets.map(async (target) => {
            try {
                await axios_1.default.post(target.url, envelope, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 5000
                });
            }
            catch (error) {
                logger_1.logger.error({ err: error, event, url: target.url }, 'Failed to dispatch webhook');
            }
        }));
    }
}
exports.WwebGateway = WwebGateway;
exports.wwebGateway = new WwebGateway();
