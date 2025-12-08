"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const rawEnv = {
    PORT: process.env.WHATSAPP_GATEWAY_PORT ??
        process.env.WWEB_SERVER_PORT ??
        '3001',
    SESSION_NAME: process.env.WHATSAPP_GATEWAY_SESSION ??
        process.env.WWEB_SESSION_NAME ??
        'default',
    WEBHOOK_URL: process.env.WHATSAPP_GATEWAY_WEBHOOK_URL ??
        process.env.WWEB_WEBHOOK_URL ??
        'http://app:3000/webhook',
    WEBHOOK_EVENTS: process.env.WHATSAPP_GATEWAY_WEBHOOK_EVENTS ??
        process.env.WWEB_WEBHOOK_EVENTS ??
        'message.any',
    DATA_DIR: process.env.WHATSAPP_GATEWAY_DATA_DIR ??
        process.env.WWEB_DATA_DIR ??
        `${process.cwd()}/data/whatsapp-gateway/session`,
    MEDIA_HOST_URL: process.env.WHATSAPP_GATEWAY_MEDIA_BASE_URL ??
        process.env.WHATSAPP_GATEWAY_HOST_URL ??
        process.env.WHATSAPP_GATEWAY_BASE_URL ??
        process.env.WWEB_MEDIA_BASE_URL ??
        process.env.WWEB_HOST_URL ??
        'http://localhost:3001',
    HEADLESS: process.env.WWEB_HEADLESS ?? 'true',
    CHROME_EXECUTABLE: process.env.WWEB_CHROME_EXECUTABLE ?? '',
    DEVICE_NAME: process.env.WWEB_DEVICE_NAME ?? 'NexusCore WWeb.js Gateway'
};
const schema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().min(1).max(65535),
    SESSION_NAME: zod_1.z.string().min(1),
    WEBHOOK_URL: zod_1.z.string().url(),
    WEBHOOK_EVENTS: zod_1.z
        .string()
        .transform((value) => value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)),
    DATA_DIR: zod_1.z.string().min(1),
    MEDIA_HOST_URL: zod_1.z.string().url(),
    HEADLESS: zod_1.z
        .string()
        .transform((value) => value.toLowerCase() !== 'false'),
    CHROME_EXECUTABLE: zod_1.z.string().optional(),
    DEVICE_NAME: zod_1.z.string().min(1)
});
exports.env = schema.parse(rawEnv);
