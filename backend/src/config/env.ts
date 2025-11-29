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
    WAHA_API_KEY: z.string().default('admin'),
    WAHA_SESSION: z.string().default('default'),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o-mini'),
    OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
    GROQ_API_KEY: z.string().optional(),
    GROQ_ROUTER_MODEL: z.string().default('llama-3.1-8b-instant'),
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
      .default(path.join(process.cwd(), 'docs', 'biznes.md')),
    TOOL_TAPAZ_BASE_URL: z.string().default('https://tap.az/s'),
    DEFAULT_LOCALE: z.string().default('az-AZ')
  })
  .superRefine((data, ctx) => {
    if (!data.OPENAI_API_KEY && !data.GROQ_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one of OPENAI_API_KEY or GROQ_API_KEY must be provided'
      });
    }
  });

export type AppEnvironment = z.infer<typeof EnvironmentSchema>;

export const env = EnvironmentSchema.parse(process.env);
