"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
exports.connectPostgres = connectPostgres;
exports.disconnectPostgres = disconnectPostgres;
const pg_1 = require("pg");
const pg_2 = __importDefault(require("pgvector/pg"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.postgresPool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: env_1.env.NODE_ENV === 'production' ? 20 : 10,
    idleTimeoutMillis: 30_000
});
exports.postgresPool.on('error', (error) => {
    logger_1.logger.error({ err: error }, 'Unexpected Postgres client error');
});
exports.postgresPool.on('connect', (client) => {
    pg_2.default
        .registerType(client)
        .catch((error) => {
        logger_1.logger.error({ err: error }, 'Failed to register pgvector type');
    });
});
async function connectPostgres() {
    const client = await exports.postgresPool.connect();
    try {
        await pg_2.default.registerType(client);
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to register pgvector type for initial client');
    }
    client.release();
    logger_1.logger.info('Postgres pool connected');
}
async function disconnectPostgres() {
    await exports.postgresPool.end();
    logger_1.logger.info('Postgres pool disconnected');
}
