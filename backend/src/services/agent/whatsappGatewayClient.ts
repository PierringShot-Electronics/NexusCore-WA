import axios, { AxiosInstance, isAxiosError } from 'axios';
import QRCode from 'qrcode';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { extractTextFromBufferedMessage } from './textUtils';

export interface SendPayload {
  chatId: string;
  messages: AgentReplyMessage[];
}

export type AgentReplyMessage = {
  type: 'text';
  body: string;
};

type SessionStatusResponse = {
  name: string;
  status: string;
  me?: {
    id: string;
    pushName?: string;
  };
};

type SessionQrResponse = {
  qr?: string;
  error?: string;
  status?: string;
};

export class WhatsappGatewayClient {
  private readonly http: AxiosInstance;
  private readonly session: string;

  constructor() {
    this.http = axios.create({
      baseURL: env.WHATSAPP_GATEWAY_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10_000
    });
    this.session = env.WHATSAPP_GATEWAY_SESSION;
  }

  public async sendMessages(payload: SendPayload): Promise<void> {
    const { chatId, messages } = payload;
    for (const message of messages) {
      if (message.type === 'text') {
        await this.sendText(chatId, message.body);
      }
    }
  }

  private async sendText(chatId: string, body: string): Promise<void> {
    if (!body.trim()) {
      return;
    }

    try {
      await this.http.post('/api/sendText', {
        session: this.session,
        chatId,
        text: body,
        linkPreview: false
      });
    } catch (error) {
      logger.error({ err: error, chatId }, 'Failed to send text message via WhatsApp gateway');
      throw error;
    }
  }

  public buildBufferedSummary(buffered: BufferedMessagePayload[]): string {
    const parts: string[] = [];
    for (const item of buffered) {
      const text = extractTextFromBufferedMessage(item);
      if (text) {
        parts.push(text);
      }
    }
    return parts.join(' ').trim();
  }

  public async getSessionStatus(): Promise<SessionStatusResponse | null> {
    try {
      const { data } = await this.http.get<SessionStatusResponse>(`/api/sessions/${this.session}`);
      return data;
    } catch (error) {
      logger.error({ err: error }, 'Failed to fetch WhatsApp gateway session status');
      return null;
    }
  }

  public async startSession(): Promise<boolean> {
    try {
      await this.http.post(`/api/sessions/${this.session}/start`);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 409) {
        logger.debug(
          { status: error.response.status },
          'WhatsApp gateway session already in desired state'
        );
        return true;
      }
      logger.error({ err: error }, 'Failed to start WhatsApp gateway session');
      return false;
    }
  }

  public async getSessionQr(): Promise<SessionQrResponse | null> {
    try {
      const { data } = await this.http.get<SessionQrResponse>(
        `/api/${this.session}/auth/qr`,
        {
          params: { format: 'raw' },
          validateStatus: (status) => status < 400 || status === 422
        }
      );

      if (data?.qr) {
        const normalized = await this.normalizeQr(data.qr);
        return { qr: normalized };
      }

      if (data?.error) {
        return data;
      }

      return null;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const payload = error.response.data as SessionQrResponse | undefined;
        return payload ?? { error: 'qr_fetch_error' };
      }
      logger.error({ err: error }, 'Failed to fetch WhatsApp gateway session QR');
      return {
        error: 'qr_fetch_error'
      };
    }
  }

  public async ensureWebhookSubscription(): Promise<void> {
    // The in-process gateway emits webhooks directly; nothing to configure.
    logger.debug('WhatsApp gateway webhook subscription handled internally; skipping.');
  }

  private async normalizeQr(raw: string): Promise<string> {
    const value = raw.trim();

    if (value.startsWith('data:image')) {
      const commaIndex = value.indexOf(',');
      if (commaIndex !== -1 && commaIndex + 1 < value.length) {
        return value.slice(commaIndex + 1).trim();
      }
      // fallback: return original data url without modification
      return value.replace(/^data:image\/png;base64,/, '').trim();
    }

    if (this.isBase64(value)) {
      return value;
    }

    try {
      const dataUrl = await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 6
      });
      return dataUrl.replace(/^data:image\/png;base64,/, '');
    } catch (error) {
      logger.warn({ err: error }, 'Failed to convert WhatsApp gateway QR to data URL');
      return value;
    }
  }

  private isBase64(input: string): boolean {
    const sanitized = input.replace(/[\r\n\s]+/g, '');
    if (sanitized.length === 0 || sanitized.length % 4 !== 0) {
      return false;
    }
    if (!/^[A-Za-z0-9+/=]+$/.test(sanitized)) {
      return false;
    }
    try {
      const buffer = Buffer.from(sanitized, 'base64');
      return buffer.length > 0;
    } catch {
      return false;
    }
  }
}

export const whatsappGatewayClient = new WhatsappGatewayClient();
