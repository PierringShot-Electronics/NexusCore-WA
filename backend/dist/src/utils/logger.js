"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_1 = require("../config/env");
const logStream_1 = require("./logStream");
exports.logger = (0, pino_1.default)({
    name: 'whatscore-backend',
    level: env_1.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: env_1.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
                translateTime: 'SYS:standard',
                colorize: true,
                singleLine: false
            }
        }
        : undefined,
    hooks: {
        logMethod(args, method, level) {
            const [message, ...rest] = args;
            (0, logStream_1.publishLog)({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                level: typeof level === 'string' ? level : this.level,
                message: String(message),
                time: new Date().toISOString(),
                details: rest.length ? rest : undefined
            });
            method.apply(this, args);
        }
    }
});
