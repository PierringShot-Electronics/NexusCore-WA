"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartBuffer = void 0;
const logger_1 = require("../../utils/logger");
const DEFAULT_LIST_PREFIX = 'chat_buffer';
class SmartBuffer {
    constructor(options) {
        this.timers = new Map();
        this.redis = options.redisClient;
        this.bufferTimeoutMs = options.bufferTimeoutMs;
        this.onFlush = options.onFlush;
        this.listPrefix = options.listPrefix ?? DEFAULT_LIST_PREFIX;
    }
    async enqueue(chatId, message) {
        const bufferKey = this.getBufferKey(chatId);
        await this.redis.rpush(bufferKey, JSON.stringify(message));
        // Keep the buffer around twice the timeout to allow delayed flush calls.
        await this.redis.pexpire(bufferKey, this.bufferTimeoutMs * 2);
        this.resetTimer(chatId);
        logger_1.logger.debug({ chatId, messageId: message.id }, 'Buffered incoming message');
    }
    async flush(chatId) {
        const bufferKey = this.getBufferKey(chatId);
        const rawMessages = await this.redis.lrange(bufferKey, 0, -1);
        if (!rawMessages.length) {
            this.clearTimer(chatId);
            return;
        }
        await this.redis.del(bufferKey);
        this.clearTimer(chatId);
        const messages = rawMessages.map((raw) => {
            try {
                const parsed = JSON.parse(raw);
                return parsed;
            }
            catch (error) {
                logger_1.logger.warn({ err: error, raw }, 'Failed to parse buffered message');
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
            logger_1.logger.debug({ chatId, count: messages.length }, 'Flushed buffered messages');
        }
        catch (error) {
            logger_1.logger.error({ err: error, chatId }, 'Smart buffer flush handler failed');
            // Re-queue messages to avoid data loss when handler fails.
            await Promise.all(messages.map((message) => this.redis.rpush(bufferKey, JSON.stringify(message))));
            this.resetTimer(chatId);
        }
    }
    async flushAll() {
        const keys = await this.redis.keys(`${this.listPrefix}:*`);
        await Promise.all(keys.map((key) => this.flush(this.parseChatId(key))));
    }
    clearTimer(chatId) {
        const timer = this.timers.get(chatId);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(chatId);
        }
    }
    resetTimer(chatId) {
        this.clearTimer(chatId);
        const timer = setTimeout(() => {
            this.flush(chatId).catch((error) => {
                logger_1.logger.error({ err: error, chatId }, 'Error flushing buffer after timeout');
            });
        }, this.bufferTimeoutMs);
        this.timers.set(chatId, timer);
    }
    getBufferKey(chatId) {
        return `${this.listPrefix}:${chatId}`;
    }
    parseChatId(bufferKey) {
        return bufferKey.replace(`${this.listPrefix}:`, '');
    }
}
exports.SmartBuffer = SmartBuffer;
