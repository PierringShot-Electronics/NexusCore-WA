import axios, { AxiosInstance, isAxiosError } from 'axios';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

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
};

type SessionQrSuccess = {
  qr: string;
};

type SessionQrFailure = {
  error: string;
  status?: string;
};

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
      if (item.type === 'text' && item.text) {
        parts.push(item.text.trim());
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
      const { data } = await this.http.get<SessionQrSuccess>(`/api/${this.session}/auth/qr`);
      return data;
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
}

export const wahaClient = new WahaClient();
