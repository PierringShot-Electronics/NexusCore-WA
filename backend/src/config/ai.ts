import { OpenAI } from 'openai';
import Groq from 'groq-sdk';
import { env } from './env';
import { logger } from '../utils/logger';

export const hasOpenAI = Boolean(env.OPENAI_API_KEY);
export const hasGroq = Boolean(env.GROQ_API_KEY);

export const openaiClient = hasOpenAI
  ? new OpenAI({
      apiKey: env.OPENAI_API_KEY
    })
  : null;

export const groqClient = hasGroq
  ? new Groq({
      apiKey: env.GROQ_API_KEY
    })
  : null;

if (!hasOpenAI) {
  logger.warn('OPENAI_API_KEY is not set. Falling back to Groq-only mode.');
}

if (!hasGroq) {
  logger.warn('GROQ_API_KEY is not set. Intent routing will use OpenAI only.');
}
