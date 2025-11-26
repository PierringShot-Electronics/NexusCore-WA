import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  name: 'whatscore-backend',
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            colorize: true,
            singleLine: false
          }
        }
      : undefined
});
