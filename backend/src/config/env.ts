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
    WAHA_BASE_URL: z.string().url().default('http://waha:3000'),
    WAHA_API_KEY: z
      .string()
      .superRefine((value, ctx) => {
        const trimmed = value.trim();
        if (trimmed.length < 16) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'WAHA_API_KEY must be at least 16 characters'
          });
        }
        if (trimmed === 'admin') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'WAHA_API_KEY cannot be "admin"; please set a secure key'
          });
        }
      })
      .transform((value) => value.trim()),
    WAHA_SESSION: z.string().default('default'),
    WAHA_WEBHOOK_URL: z.string().url().default('http://app:3000/webhook'),
    WAHA_WEBHOOK_EVENTS: z
      .string()
      .default('message,session.status'),
    MCP_PORT: z.string().default('3030'),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    OPENAI_VISION_MODEL: z.string().default('gpt-4o-mini'),
    OPENAI_TRANSCRIPTION_MODEL: z.string().default('whisper-large-v3-turbo'),
    OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
    GROQ_API_KEY: z.string().optional(),
    GROQ_ROUTER_MODEL: z.string().default('llama-3.1-8b-instant'),
    GROQ_COMPLETION_MODEL: z.string().default('llama-3.1-70b-versatile'),
    GROQ_VISION_MODEL: z.string().default('llama-3.2-11b-vision-preview'),
    GROQ_TRANSCRIPTION_MODEL: z.string().default('whisper-large-v3-turbo'),
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
    DEFAULT_LOCALE: z.string().default('az-AZ')
  });

export type AppEnvironment = z.infer<typeof EnvironmentSchema>;

export const env = EnvironmentSchema.parse(process.env);
