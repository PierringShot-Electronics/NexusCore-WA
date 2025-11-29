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
  engine?: {
    engine: string;
    state: string;
  };
  me?: {
    id: string;
    pushName?: string;
  };
  config?: {
    webhooks?: Array<{
      url: string;
      events?: string[];
    }>;
    [key: string]: unknown;
  } | null;
};

type SessionQrSuccess = {
  qr: string;
};

type SessionQrFailure = {
  error: string;
  status?: string;
};

type SessionQrRawResponse =
  | { value?: unknown }
  | { data?: unknown; mimetype?: unknown }
  | string;

export class WahaClient {
  private readonly http: AxiosInstance;
  private readonly session: string;

  constructor() {
    this.http = axios.create({
      baseURL: env.WAHA_BASE_URL,
      headers: {
        'X-Api-Key': env.WAHA_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10_000
    });
    this.session = env.WAHA_SESSION;
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
      logger.error({ err: error, chatId }, 'Failed to send text message via WAHA');
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
      logger.error({ err: error }, 'Failed to fetch WAHA session status');
      return null;
    }
  }

  public async startSession(): Promise<boolean> {
    try {
      await this.http.post(`/api/sessions/${this.session}/start`);
      return true;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        (error.response.status === 409 || error.response.status === 423)
      ) {
        // Session already started or locked; treat as success for idempotency.
        logger.debug({ status: error.response.status }, 'WAHA session already in desired state');
        return true;
      }
      logger.error({ err: error }, 'Failed to start WAHA session');
      return false;
    }
  }

  public async getSessionQr(): Promise<SessionQrSuccess | SessionQrFailure | null> {
    try {
      const { data, headers } =
        await this.http.get<SessionQrRawResponse>(`/api/${this.session}/auth/qr`, {
          params: { format: 'raw' },
          responseType: 'json',
          // WAHA may respond with 422 while session is starting; allow for fallback handling below.
          validateStatus: (status) => status < 400 || status === 422
        });

      const normalized = await this.normalizeQrResponse(data);
      if (normalized) {
        return normalized;
      }

      const contentType = headers['content-type'];
      if (typeof contentType === 'string' && contentType.includes('image/')) {
        logger.warn({ contentType }, 'WAHA returned binary QR image; converting is not supported in JSON mode');
        return {
          error: 'qr_binary_payload'
        };
      }

      logger.warn({ data }, 'Unexpected WAHA QR payload');
      return {
        error: 'qr_unexpected_payload'
      };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const payload = error.response.data as SessionQrFailure | undefined;
        if (error.response.status === 422) {
          logger.debug(
            {
              status: payload?.status,
              message: payload?.error
            },
            'WAHA session not ready for QR fetch'
          );
          return {
            error: payload?.error ?? 'session_not_ready',
            status: payload?.status
          };
        }

        logger.warn(
          { status: error.response.status, data: error.response.data },
          'Unexpected response while fetching WAHA session QR'
        );
        return {
          error: payload?.error ?? 'qr_fetch_error',
          status: payload?.status
        };
      }

      logger.error({ err: error }, 'Failed to fetch WAHA session QR');
      return {
        error: 'qr_fetch_error'
      };
    }
  }

  public async ensureWebhookSubscription(): Promise<void> {
    const targetUrl = env.WAHA_WEBHOOK_URL;
    const events = env.WAHA_WEBHOOK_EVENTS.split(',')
      .map((event) => event.trim())
      .filter((event) => event.length > 0);

    try {
      const { data } = await this.http.get<SessionStatusResponse>(
        `/api/sessions/${this.session}`
      );

      const existing =
        data?.config?.webhooks?.find((webhook) => webhook.url === targetUrl);

      if (existing) {
        const hasAllEvents =
          Array.isArray(existing.events) &&
          events.every((event) => existing.events?.includes(event));

        if (hasAllEvents) {
          logger.debug(
            { session: this.session, url: targetUrl },
            'WAHA webhook subscription already up to date'
          );
          return;
        }
      }

      const updatedConfig = {
        ...(data?.config ?? {}),
        webhooks: [
          {
            url: targetUrl,
            events: Array.from(new Set([...events, 'session.status']))
          }
        ]
      };

      await this.http.put(`/api/sessions/${this.session}`, {
        config: updatedConfig
      });

      logger.info(
        { session: this.session, url: targetUrl, events: updatedConfig.webhooks[0]?.events },
        'Configured WAHA webhook subscription'
      );
    } catch (error) {
      logger.error(
        { err: error, session: this.session },
        'Failed to configure WAHA webhook subscription'
      );
    }
  }

  private async normalizeQrResponse(
    data: SessionQrRawResponse
  ): Promise<SessionQrSuccess | null> {
    const rawValue = this.extractRawValue(data);
    if (!rawValue) {
      return null;
    }

    if (this.isBase64(rawValue)) {
      return { qr: rawValue };
    }

    try {
      const dataUrl = await QRCode.toDataURL(rawValue, {
        errorCorrectionLevel: 'M',
        margin: 1,
        scale: 6
      });
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      return { qr: base64 };
    } catch (error) {
      logger.warn({ err: error }, 'Failed to convert WAHA QR value to image');
      return null;
    }
  }

  private extractRawValue(data: SessionQrRawResponse): string | null {
    if (!data) {
      return null;
    }

    if (typeof data === 'string') {
      return data.trim();
    }

    if (typeof data === 'object') {
      if ('value' in data && typeof (data as { value?: unknown }).value === 'string') {
        return (data as { value: string }).value.trim();
      }

      if ('data' in data && typeof (data as { data?: unknown }).data === 'string') {
        return (data as { data: string }).data.trim();
      }
    }

    return null;
  }

  private isBase64(value: string): boolean {
    const sanitized = value.replace(/[\r\n\s]+/g, '');
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

export const wahaClient = new WahaClient();
