import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  APP_PORT: z
    .string()
    .default('3000')
    .transform((value) => Number(value)),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  WAHA_BASE_URL: z.string().url().default('http://waha:3000'),
  OPENAI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  SESSION_SECRET: z.string().default('change-me'),
  BUFFER_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : 8000))
    .refine((value) => value > 0, {
      message: 'BUFFER_TIMEOUT_MS must be greater than 0'
    })
});

export type AppEnvironment = z.infer<typeof EnvironmentSchema>;

export const env = EnvironmentSchema.parse(process.env);
