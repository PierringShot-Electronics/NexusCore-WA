import 'dotenv/config';
import { z } from 'zod';

const rawEnv = {
  PORT:
    process.env.WHATSAPP_GATEWAY_PORT ??
    process.env.WWEB_SERVER_PORT ??
    '3001',
  SESSION_NAME:
    process.env.WHATSAPP_GATEWAY_SESSION ??
    process.env.WWEB_SESSION_NAME ??
    'default',
  WEBHOOK_URL:
    process.env.WHATSAPP_GATEWAY_WEBHOOK_URL ??
    process.env.WWEB_WEBHOOK_URL ??
    'http://app:3000/webhook',
  WEBHOOK_EVENTS:
    process.env.WHATSAPP_GATEWAY_WEBHOOK_EVENTS ??
    process.env.WWEB_WEBHOOK_EVENTS ??
    'message.any',
  DATA_DIR:
    process.env.WHATSAPP_GATEWAY_DATA_DIR ??
    process.env.WWEB_DATA_DIR ??
    `${process.cwd()}/data/whatsapp-gateway/session`,
  MEDIA_HOST_URL:
    process.env.WHATSAPP_GATEWAY_MEDIA_BASE_URL ??
    process.env.WHATSAPP_GATEWAY_HOST_URL ??
    process.env.WHATSAPP_GATEWAY_BASE_URL ??
    process.env.WWEB_MEDIA_BASE_URL ??
    process.env.WWEB_HOST_URL ??
    'http://localhost:3001',
  HEADLESS: process.env.WWEB_HEADLESS ?? 'true',
  CHROME_EXECUTABLE: process.env.WWEB_CHROME_EXECUTABLE ?? '',
  DEVICE_NAME: process.env.WWEB_DEVICE_NAME ?? 'NexusCore WWeb.js Gateway'
};

const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535),
  SESSION_NAME: z.string().min(1),
  WEBHOOK_URL: z.string().url(),
  WEBHOOK_EVENTS: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  DATA_DIR: z.string().min(1),
  MEDIA_HOST_URL: z.string().url(),
  HEADLESS: z
    .string()
    .transform((value) => value.toLowerCase() !== 'false'),
  CHROME_EXECUTABLE: z.string().optional(),
  DEVICE_NAME: z.string().min(1)
});

export const env = schema.parse(rawEnv);
