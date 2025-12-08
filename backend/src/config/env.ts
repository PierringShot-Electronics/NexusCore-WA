import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_PORT: z
      .string()
      .default('3000')
      .transform((value) => Number(value)),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    WHATSAPP_GATEWAY_BASE_URL: z
      .string()
      .url()
      .default('http://wweb:3001'),
    WHATSAPP_GATEWAY_SESSION: z.string().default('default'),
    MCP_PORT: z.string().default('3030'),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    OPENAI_VISION_MODEL: z.string().default('gpt-4o'),
    OPENAI_TRANSCRIPTION_MODEL: z.string().default('whisper-1'),
    OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
    OPENAI_TTS_MODEL: z.string().default('tts-1'),
    OPENAI_TTS_VOICE: z.string().default('alloy'),
    OPENAI_ROUTER_MODEL: z.string().default('gpt-4o-mini'),
    GROQ_API_KEY: z.string().optional(),
    GROQ_ROUTER_MODEL: z.string().default('llama-3.1-8b-instant'),
    GROQ_COMPLETION_MODEL: z.string().default('llama-3.1-70b-versatile'),
    GROQ_VISION_MODEL: z.string().default('llama-3.2-11b-vision-preview'),
    GROQ_TRANSCRIPTION_MODEL: z.string().default('whisper-large-v3-turbo'),
    AGENT_MODEL_GENERAL: z.string().default('gpt-4o-mini'),
    AGENT_MODEL_SALES: z.string().default('gpt-4o'),
    AGENT_MODEL_SUPPORT: z.string().default('gpt-4o-mini'),
    AGENT_MODEL_DIAGNOSTICS: z.string().default('gpt-4o'),
    SESSION_SECRET: z.string().default('change-me'),
    BUFFER_TIMEOUT_MS: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 8000))
      .refine((value) => value > 0, {
        message: 'BUFFER_TIMEOUT_MS must be greater than 0'
      }),
    BUSINESS_RULES_PATH: z
      .string()
      .default(path.join(process.cwd(), 'data', 'biznes.md')),
    TOOL_TAPAZ_BASE_URL: z.string().default('https://tap.az/s'),
    DEFAULT_LOCALE: z.string().default('az-AZ'),
    TELEMETRY_ENABLED: z
      .string()
      .optional()
      .transform((value) => (value ? value.toLowerCase() !== 'false' : true)),
    TELEMETRY_REDIS_STREAM: z.string().default('telemetry:events'),
    TELEMETRY_STREAM_MAX_LENGTH: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 500))
      .refine((value) => value > 0, {
        message: 'TELEMETRY_STREAM_MAX_LENGTH must be greater than 0'
      }),
    TELEMETRY_HISTORY_LIMIT: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 200))
      .refine((value) => value > 0, {
        message: 'TELEMETRY_HISTORY_LIMIT must be greater than 0'
      })
  });

export type AppEnvironment = z.infer<typeof EnvironmentSchema>;

export const env = EnvironmentSchema.parse(process.env);
