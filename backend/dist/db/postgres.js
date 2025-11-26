"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
exports.connectPostgres = connectPostgres;
exports.disconnectPostgres = disconnectPostgres;
const pg_1 = require("pg");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const pg_2 = require("pgvector/pg");
exports.postgresPool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: env_1.env.NODE_ENV === 'production' ? 20 : 10,
    idleTimeoutMillis: 30_000
});
(0, pg_2.registerTypeParser)(exports.postgresPool);
exports.postgresPool.on('error', (error) => {
    logger_1.logger.error({ err: error }, 'Unexpected Postgres client error');
});
async function connectPostgres() {
    const client = await exports.postgresPool.connect();
    client.release();
    logger_1.logger.info('Postgres pool connected');
}
async function disconnectPostgres() {
    await exports.postgresPool.end();
    logger_1.logger.info('Postgres pool disconnected');
}
