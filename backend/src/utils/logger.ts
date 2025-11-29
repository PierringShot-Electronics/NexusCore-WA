import pino from 'pino';
import { env } from '../config/env';
import { publishLog } from './logStream';

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
      : undefined,
  hooks: {
    logMethod(args, method, level) {
      const [message, ...rest] = args;
      publishLog({
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
