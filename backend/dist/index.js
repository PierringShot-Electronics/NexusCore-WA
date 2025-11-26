"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const server_1 = require("./server");
const postgres_1 = require("./db/postgres");
const redis_1 = require("./db/redis");
const smartBuffer_1 = require("./services/buffer/smartBuffer");
const agentService_1 = require("./services/agent/agentService");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, postgres_1.connectPostgres)();
    await (0, redis_1.connectRedis)();
    const buffer = new smartBuffer_1.SmartBuffer({
        redisClient: redis_1.redis,
        bufferTimeoutMs: env_1.env.BUFFER_TIMEOUT_MS,
        onFlush: async (chatId, messages) => {
            await agentService_1.agentService.handleBufferedMessages({
                chatExternalId: chatId,
                bufferedMessages: messages
            });
        }
    });
    const app = (0, server_1.createApp)(buffer);
    const server = http_1.default.createServer(app);
    server.listen(env_1.env.APP_PORT, () => {
        logger_1.logger.info({ port: env_1.env.APP_PORT, env: env_1.env.NODE_ENV }, 'WhatsCore backend listening');
    });
    const shutdown = async (signal) => {
        logger_1.logger.info({ signal }, 'Received shutdown signal');
        try {
            await buffer.flushAll();
            await (0, redis_1.disconnectRedis)();
            await (0, postgres_1.disconnectPostgres)();
        }
        catch (error) {
            logger_1.logger.error({ err: error }, 'Error during shutdown');
        }
        finally {
            server.close(() => {
                logger_1.logger.info('HTTP server closed');
                process.exit(0);
            });
        }
    };
    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
}
bootstrap().catch((error) => {
    logger_1.logger.error({ err: error }, 'Fatal error while bootstrapping application');
    process.exit(1);
});
