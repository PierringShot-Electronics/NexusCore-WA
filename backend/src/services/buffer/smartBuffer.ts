import type Redis from 'ioredis';
import { logger } from '../../utils/logger';

export type BufferedMessageType =
  | 'text'
  | 'audio'
  | 'image'
  | 'video'
  | 'document'
  | 'unknown';

export interface BufferedMessagePayload {
  id: string;
  type: BufferedMessageType;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  mimeType?: string;
  caption?: string;
  raw: unknown;
  receivedAt: string;
}

export type FlushHandler = (
  chatId: string,
  messages: BufferedMessagePayload[]
) => Promise<void> | void;

interface SmartBufferOptions {
  redisClient: Redis;
  bufferTimeoutMs: number;
  onFlush: FlushHandler;
  listPrefix?: string;
}

const DEFAULT_LIST_PREFIX = 'chat_buffer';

export class SmartBuffer {
  private readonly redis: Redis;
  private readonly bufferTimeoutMs: number;
  private readonly onFlush: FlushHandler;
  private readonly listPrefix: string;
  private readonly timers: Map<string, NodeJS.Timeout> = new Map();

  constructor(options: SmartBufferOptions) {
    this.redis = options.redisClient;
    this.bufferTimeoutMs = options.bufferTimeoutMs;
    this.onFlush = options.onFlush;
    this.listPrefix = options.listPrefix ?? DEFAULT_LIST_PREFIX;
  }

  public async enqueue(
    chatId: string,
    message: BufferedMessagePayload
  ): Promise<void> {
    const bufferKey = this.getBufferKey(chatId);
    await this.redis.rpush(bufferKey, JSON.stringify(message));
    // Keep the buffer around twice the timeout to allow delayed flush calls.
    await this.redis.pexpire(bufferKey, this.bufferTimeoutMs * 2);

    this.resetTimer(chatId);
    logger.debug({ chatId, messageId: message.id }, 'Buffered incoming message');
  }

  public async flush(chatId: string): Promise<void> {
    const bufferKey = this.getBufferKey(chatId);
    const rawMessages = await this.redis.lrange(bufferKey, 0, -1);

    if (!rawMessages.length) {
      this.clearTimer(chatId);
      return;
    }

    await this.redis.del(bufferKey);
    this.clearTimer(chatId);

    const messages: BufferedMessagePayload[] = rawMessages.map((raw) => {
      try {
        const parsed = JSON.parse(raw) as BufferedMessagePayload;
        return parsed;
      } catch (error) {
        logger.warn({ err: error, raw }, 'Failed to parse buffered message');
        return {
          id: `invalid-${Date.now()}`,
          type: 'unknown',
          raw,
          receivedAt: new Date().toISOString()
        };
      }
    });

    try {
      await this.onFlush(chatId, messages);
      logger.debug({ chatId, count: messages.length }, 'Flushed buffered messages');
    } catch (error) {
      logger.error({ err: error, chatId }, 'Smart buffer flush handler failed');
      // Re-queue messages to avoid data loss when handler fails.
      await Promise.all(
        messages.map((message) =>
          this.redis.rpush(bufferKey, JSON.stringify(message))
        )
      );
      this.resetTimer(chatId);
    }
  }

  public async flushAll(): Promise<void> {
    const keys = await this.redis.keys(`${this.listPrefix}:*`);
    await Promise.all(keys.map((key) => this.flush(this.parseChatId(key))));
  }

  public clearTimer(chatId: string): void {
    const timer = this.timers.get(chatId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(chatId);
    }
  }

  private resetTimer(chatId: string): void {
    this.clearTimer(chatId);
    const timer = setTimeout(() => {
      this.flush(chatId).catch((error) => {
        logger.error({ err: error, chatId }, 'Error flushing buffer after timeout');
      });
    }, this.bufferTimeoutMs);
    this.timers.set(chatId, timer);
  }

  private getBufferKey(chatId: string): string {
    return `${this.listPrefix}:${chatId}`;
  }

  private parseChatId(bufferKey: string): string {
    return bufferKey.replace(`${this.listPrefix}:`, '');
  }
}
