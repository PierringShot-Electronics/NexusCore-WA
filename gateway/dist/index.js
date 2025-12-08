"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server_1 = require("./server");
const env_1 = require("./config/env");
const client_1 = require("./wweb/client");
const logger_1 = require("./logger");
async function bootstrap() {
    const app = (0, server_1.createServer)();
    const server = http_1.default.createServer(app);
    server.listen(env_1.env.PORT, () => {
        logger_1.logger.info({ port: env_1.env.PORT }, 'WWeb.js gateway listening');
    });
    try {
        await client_1.wwebGateway.start();
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Initial WWeb.js bootstrap failed (will require manual start)');
    }
    const shutdown = async (signal) => {
        logger_1.logger.info({ signal }, 'Received shutdown signal');
        try {
            await client_1.wwebGateway.stop();
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
    logger_1.logger.error({ err: error }, 'Fatal error while starting gateway');
    process.exit(1);
});
