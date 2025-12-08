import axios from 'axios';
import { mkdirSync } from 'fs';
import QRCode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { Client, LocalAuth, Message, MessageMedia, Chat, Contact } from 'whatsapp-web.js';
import { env } from '../config/env';
import { logger } from '../logger';

export type SessionState =
  | 'INITIALIZING'
  | 'SCAN_QR_CODE'
  | 'CONNECTING'
  | 'WORKING'
  | 'DISCONNECTED'
  | 'FAILED';

export interface SessionStatus {
  name: string;
  status: SessionState;
  me?: {
    id: string;
    pushName?: string;
  };
}

export interface SessionDetails extends SessionStatus {
  config: {
    webhooks: Array<{ url: string; events: string[] }>;
  };
}

export interface OutgoingMessagePayload {
  chatId: string;
  text?: string;
  mediaUrl?: string;
  mediaMimeType?: string;
  mediaBase64?: string;
  caption?: string;
  voicePtt?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    title?: string;
  };
  contact?: {
    vcard: string;
  };
  reaction?: {
    messageId: string;
    emoji: string;
  };
}

type WebhookEnvelope = {
  event: string;
  payload: Record<string, unknown>;
};

export class WwebGateway {
  private client: Client | null = null;
  private sessionState: SessionState = 'INITIALIZING';
  private lastQrDataUrl: string | null = null;
  private me: SessionStatus['me'] = undefined;
  private webhooks: Array<{ url: string; events: string[] }> = [
    {
      url: env.WEBHOOK_URL,
      events: env.WEBHOOK_EVENTS
    }
  ];

  public async start(): Promise<void> {
    if (this.client) {
      return;
    }

    const authDataPath = env.DATA_DIR;
    try {
      mkdirSync(authDataPath, { recursive: true });
    } catch (error) {
      logger.warn({ err: error, authDataPath }, 'Failed to ensure auth data directory');
    }

    const authStrategy = new LocalAuth({
      clientId: env.SESSION_NAME,
      dataPath: authDataPath
    });

    this.client = new Client({
      authStrategy,
      puppeteer: {
        headless: env.HEADLESS,
        executablePath: env.CHROME_EXECUTABLE || undefined,
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
      logger.info('WWeb.js client initialised');
    } catch (error) {
      logger.error({ err: error }, 'Failed to initialise WWeb.js client');
      this.sessionState = 'FAILED';
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (!this.client) {
      return;
    }
    try {
      await this.client.destroy();
    } catch (error) {
      logger.warn({ err: error }, 'Error while destroying WWeb.js client');
    } finally {
      this.client = null;
      this.sessionState = 'DISCONNECTED';
    }
  }

  public getStatus(): SessionStatus {
    return {
      name: env.SESSION_NAME,
      status: this.sessionState,
      me: this.me
    };
  }

  public isReady(): boolean {
    return this.sessionState === 'WORKING';
  }

  private requireClient(): Client {
    if (!this.client || !this.isReady()) {
      throw new Error('session_not_ready');
    }
    return this.client;
  }

  public getSessionDetails(): SessionDetails {
    return {
      ...this.getStatus(),
      config: {
        webhooks: this.webhooks
      }
    };
  }

  public updateWebhooks(webhooks: Array<{ url?: string; events?: string[] }>): void {
    const normalized = webhooks
      .filter((entry) => typeof entry?.url === 'string' && entry.url.length > 0)
      .map((entry) => ({
        url: entry.url as string,
        events:
          Array.isArray(entry.events) && entry.events.length > 0
            ? entry.events
            : env.WEBHOOK_EVENTS
      }));

    this.webhooks = normalized.length > 0 ? normalized : this.webhooks;
    logger.info({ webhooks: this.webhooks }, 'Updated gateway webhook configuration');
  }

  public async getQrDataUrl(): Promise<string | null> {
    return this.lastQrDataUrl;
  }

  public async sendText(
    chatId: string,
    text: string,
    options: { linkPreview?: boolean } = {}
  ): Promise<string> {
    const client = this.requireClient();
    if (!text.trim()) {
      return '';
    }
    const message = await client.sendMessage(chatId, text, {
      linkPreview: options.linkPreview ?? false
    });
    return this.extractMessageId(message);
  }

  public async sendMediaFromUrl(
    chatId: string,
    url: string,
    options: {
      caption?: string;
      asVoice?: boolean;
      asDocument?: boolean;
      fileName?: string;
      mimeType?: string;
    } = {}
  ): Promise<string> {
    let download: MessageMedia;
    try {
      download = await MessageMedia.fromUrl(url, {
        unsafeMime: true,
        filename: options.fileName
      });
    } catch (error) {
      if (options.asVoice) {
        download = await this.fetchMediaFromUrl(url, options.fileName, 'audio/ogg; codecs=opus');
      } else {
        throw error;
      }
    }
    if (options.mimeType) {
      download.mimetype = options.mimeType;
    }
    return this.dispatchMedia(chatId, download, options);
  }

  public async sendMediaFromBase64(
    chatId: string,
    base64: string,
    options: {
      caption?: string;
      asVoice?: boolean;
      asDocument?: boolean;
      fileName?: string;
      mimeType?: string;
    } = {}
  ): Promise<string> {
    const media = new MessageMedia(
      options.mimeType || 'application/octet-stream',
      base64,
      options.fileName || undefined
    );
    return this.dispatchMedia(chatId, media, options);
  }

  public async sendLocation(
    chatId: string,
    latitude: number,
    longitude: number,
    name?: string
  ): Promise<void> {
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
    await client.sendMessage(chatId, description || ' ', { location: locationPayload } as any);
  }

  public async sendVcard(chatId: string, vcard: string): Promise<void> {
    const client = this.requireClient();
    const sanitized = vcard.trim().replace(/^"+|"+$/g, '');
    const normalized = sanitized.replace(/\\n/g, '\n');
    await client.sendMessage(chatId, normalized, { parseVCards: true });
  }

  private async fetchMediaFromUrl(
    url: string,
    fileName?: string,
    forcedMime?: string
  ): Promise<MessageMedia> {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      timeout: 20000
    });
    const buffer = Buffer.from(response.data);
    const contentTypeHeader = response.headers['content-type'];
    const mime =
      forcedMime ||
      (typeof contentTypeHeader === 'string' && contentTypeHeader.length > 0
        ? contentTypeHeader
        : 'application/octet-stream');
    const resolvedFilename = this.resolveFileName(url, fileName, mime);
    return new MessageMedia(mime, buffer.toString('base64'), resolvedFilename, buffer.byteLength);
  }

  private resolveFileName(url: string, provided: string | undefined, mime: string): string {
    if (provided && provided.length > 0) {
      return provided;
    }
    try {
      const parsed = new URL(url);
      const candidate = parsed.pathname.split('/').filter(Boolean).pop();
      if (candidate) {
        return candidate;
      }
    } catch {
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

  private async dispatchMedia(
    chatId: string,
    media: MessageMedia,
    options: {
      caption?: string;
      asVoice?: boolean;
      asDocument?: boolean;
      fileName?: string;
      mimeType?: string;
    }
  ): Promise<string> {
    const client = this.requireClient();
    if (!media.filename && options.fileName) {
      media.filename = options.fileName;
    }
    if (options.asVoice) {
      media.mimetype = options.mimeType ?? 'audio/ogg; codecs=opus';
      if (!media.filename) {
        media.filename = 'voice-note.ogg';
      }
    } else if (options.mimeType) {
      media.mimetype = options.mimeType;
    }
    const sendOptions: Record<string, unknown> = {
      caption: options.caption,
      sendAudioAsVoice: Boolean(options.asVoice),
      sendMediaAsDocument: Boolean(options.asDocument),
      filename: media.filename
    };
    if (options.asVoice) {
      sendOptions.ptt = true;
    }
    const message = await client.sendMessage(chatId, media, sendOptions as any);
    return this.extractMessageId(message);
  }

  public async getMessageMedia(
    messageId: string
  ): Promise<{ data: Buffer; mimetype: string; filename: string } | null> {
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
      const mimetype =
        typeof media.mimetype === 'string' && media.mimetype.length > 0
          ? media.mimetype
          : 'application/octet-stream';
      const filenameCandidate =
        typeof media.filename === 'string' && media.filename.length > 0
          ? media.filename
          : undefined;
      const fallbackName = this.buildDefaultFilename(messageId, mimetype);
      const filename = this.sanitizeFilename(filenameCandidate ?? fallbackName);
      return {
        data: buffer,
        mimetype,
        filename
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'session_not_ready') {
        throw error;
      }
      logger.error({ err: error, messageId }, 'Failed to download message media');
      throw error;
    }
  }

  public async sendReaction(messageId: string, emoji: string): Promise<void> {
    const client = this.requireClient();
    try {
      const message = await client.getMessageById(messageId);
      if (!message) {
        throw new Error('message_not_found');
      }
      await message.react(emoji);
    } catch (error) {
      logger.error({ err: error, messageId }, 'Failed to send reaction');
      throw error;
    }
  }

  public async getChat(chatId: string): Promise<Chat | null> {
    if (!this.client) {
      return null;
    }
    try {
      return await this.client.getChatById(chatId);
    } catch (error) {
      logger.warn({ err: error, chatId }, 'Failed to fetch chat by id');
      return null;
    }
  }

  public async getChats(): Promise<Chat[]> {
    if (!this.client) {
      return [];
    }
    try {
      return await this.client.getChats();
    } catch (error) {
      logger.warn({ err: error }, 'Failed to fetch chats');
      return [];
    }
  }

  public async getContacts(): Promise<Contact[]> {
    if (!this.client) {
      return [];
    }
    try {
      return await this.client.getContacts();
    } catch (error) {
      logger.warn({ err: error }, 'Failed to fetch contacts');
      return [];
    }
  }

  public async checkNumberRegistration(phone: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('WWeb.js client not initialised');
    }
    try {
      return await this.client.isRegisteredUser(phone);
    } catch (error) {
      logger.warn({ err: error, phone }, 'Failed to check number registration');
      return false;
    }
  }

  public async getContactAbout(contactId: string): Promise<string | null> {
    const contact = await this.getContact(contactId);
    if (!contact) {
      return null;
    }
    try {
      return (await contact.getAbout()) ?? null;
    } catch (error) {
      logger.warn({ err: error, contactId }, 'Failed to fetch contact about');
      return null;
    }
  }

  public async getContactProfilePicture(contactId: string): Promise<string | null> {
    const contact = await this.getContact(contactId);
    if (!contact) {
      return null;
    }
    try {
      return (await contact.getProfilePicUrl()) ?? null;
    } catch (error) {
      logger.warn({ err: error, contactId }, 'Failed to fetch profile picture');
      return null;
    }
  }

  public async sendSeen(chatId: string): Promise<void> {
    const client = this.requireClient();
    await client.sendSeen(chatId);
  }

  public async setTyping(chatId: string, typing: boolean): Promise<void> {
    this.requireClient();
    const chat = await this.getChat(chatId);
    if (!chat) {
      throw new Error('chat_not_found');
    }
    if (typing) {
      await chat.sendStateTyping();
    } else {
      await chat.clearState();
    }
  }

  public async getChatMessages(chatId: string, limit = 20): Promise<Message[]> {
    if (!this.isReady()) {
      return [];
    }
    const chat = await this.getChat(chatId);
    if (!chat) {
      return [];
    }
    try {
      return await chat.fetchMessages({ limit });
    } catch (error) {
      logger.warn({ err: error, chatId }, 'Failed to fetch chat messages');
      return [];
    }
  }

  private extractMessageId(message: Message): string {
    const rawId = (message.id as { _serialized?: string; id?: string })?._serialized;
    if (rawId && rawId.length > 0) {
      return rawId;
    }
    const nested = (message.id as { id?: string }).id;
    if (nested && nested.length > 0) {
      return nested;
    }
    return typeof message.id === 'string' ? message.id : '';
  }

  private buildMediaUrlWithSession(path: string): string {
    try {
      const baseUrl = new URL(env.MEDIA_HOST_URL);
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      const url = new URL(normalizedPath, baseUrl);
      url.searchParams.set('session', env.SESSION_NAME);
      return url.toString();
    } catch {
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}session=${encodeURIComponent(env.SESSION_NAME)}`;
    }
  }

  private sanitizeFilename(name: string): string {
    const cleaned = name.replace(/[\r\n\t"]/g, '').replace(/[/\\?%*:|<>]/g, '-').trim();
    return cleaned.length > 0 ? cleaned : 'attachment';
  }

  private buildDefaultFilename(messageId: string, mimetype: string): string {
    const sanitizedId = messageId.replace(/[^a-zA-Z0-9_-]+/g, '');
    const extension = this.inferExtensionFromMime(mimetype);
    const base = sanitizedId.length > 0 ? sanitizedId : 'attachment';
    return extension ? `${base}.${extension}` : base;
  }

  private inferExtensionFromMime(mimetype: string): string {
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

  public async getContact(contactId: string): Promise<Contact | null> {
    if (!this.client) {
      return null;
    }
    try {
      return await this.client.getContactById(contactId);
    } catch (error) {
      logger.warn({ err: error, contactId }, 'Failed to fetch contact');
      return null;
    }
  }

  private registerClientEvents(client: Client): void {
    client.on('loading_screen', (percent, message) => {
      logger.debug({ percent, message }, 'WWeb.js loading');
      this.sessionState = 'CONNECTING';
    });

    client.on('qr', async (qr) => {
      this.sessionState = 'SCAN_QR_CODE';
      try {
        this.lastQrDataUrl = await QRCode.toDataURL(qr, { errorCorrectionLevel: 'M' });
        qrcodeTerminal.generate(qr, { small: true });
      } catch (error) {
        logger.error({ err: error }, 'Failed to encode QR code');
      }
    });

    client.on('authenticated', (session) => {
      logger.info({ sessionKeys: Object.keys(session || {}) }, 'WWeb.js authenticated');
      this.sessionState = 'CONNECTING';
    });

    client.on('auth_failure', (message) => {
      logger.error({ message }, 'WWeb.js authentication failure');
      this.sessionState = 'FAILED';
    });

    client.on('ready', async () => {
      logger.info('WWeb.js client ready');
      this.sessionState = 'WORKING';
      try {
        const info = client.info;
        if (info?.wid?._serialized) {
          this.me = {
            id: info.wid._serialized,
            pushName: info.pushname
          };
        }
      } catch (error) {
        logger.warn({ err: error }, 'Failed to read self info');
      }
    });

    client.on('disconnected', (reason) => {
      logger.warn({ reason }, 'WWeb.js disconnected');
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

  private serializeMessage(message: Message): Record<string, unknown> {
    const raw = message as Message & Record<string, any>;
    const messageId =
      ((raw.id as { _serialized?: string })?._serialized ??
        (raw.id as { id?: string })?.id ??
        (typeof raw.id === 'string' ? raw.id : null)) ?? null;

    const baseMediaPath =
      messageId !== null ? `/api/messages/${encodeURIComponent(messageId)}/media` : null;
    const mediaUrl =
      raw.hasMedia && baseMediaPath ? this.buildMediaUrlWithSession(baseMediaPath) : undefined;

    const mimetype =
      typeof raw.mimetype === 'string'
        ? raw.mimetype
        : typeof raw.media?._data?.mimetype === 'string'
          ? raw.media._data.mimetype
          : typeof raw._data?.mimetype === 'string'
            ? raw._data.mimetype
            : undefined;

    const filename =
      typeof raw.filename === 'string'
        ? raw.filename
        : typeof raw.media?._data?.filename === 'string'
          ? raw.media._data.filename
          : typeof raw._data?.filename === 'string'
            ? raw._data.filename
            : undefined;

    const payload: Record<string, unknown> = {
      id: messageId,
      from: raw.from,
      to: raw.to,
      chatId: raw.from,
      timestamp: raw.timestamp,
      type: raw.type,
      body: raw.body,
      caption:
        typeof raw.caption === 'string'
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

  private async dispatchWebhook(event: string, payload: Record<string, unknown>): Promise<void> {
    const envelope: WebhookEnvelope = {
      event,
      payload
    };
    const targets = this.webhooks.length > 0 ? this.webhooks : [{ url: env.WEBHOOK_URL, events: env.WEBHOOK_EVENTS }];
    await Promise.all(
      targets.map(async (target) => {
        try {
          await axios.post(target.url, envelope, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
          });
        } catch (error) {
          logger.error({ err: error, event, url: target.url }, 'Failed to dispatch webhook');
        }
      })
    );
  }
}

export const wwebGateway = new WwebGateway();
