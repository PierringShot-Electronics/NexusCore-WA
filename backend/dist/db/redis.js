"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.connectRedis = connectRedis;
exports.disconnectRedis = disconnectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 100, 3000),
    maxRetriesPerRequest: null
});
exports.redis.on('error', (error) => {
    logger_1.logger.error({ err: error }, 'Redis connection error');
});
exports.redis.on('connect', () => {
    logger_1.logger.info('Redis connected');
});
async function connectRedis() {
    await exports.redis.connect();
}
async function disconnectRedis() {
    await exports.redis.quit();
    logger_1.logger.info('Redis disconnected');
}
