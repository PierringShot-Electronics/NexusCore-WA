import { telemetryEventBus, type TelemetryEvent } from './eventBus';
import { env } from '../../config/env';
import { redis } from '../../db/redis';
import { logger } from '../../utils/logger';

const STREAM = env.TELEMETRY_REDIS_STREAM;
const MAX_LEN = env.TELEMETRY_STREAM_MAX_LENGTH;

let storageRegistered = false;

export function registerTelemetryStorage(): void {
  if (storageRegistered || !env.TELEMETRY_ENABLED) {
    return;
  }
  storageRegistered = true;

  telemetryEventBus.on((event) => {
    void redis
      .xadd(
        STREAM,
        'MAXLEN',
        '~',
        MAX_LEN,
        '*',
        'event',
        JSON.stringify(event)
      )
      .catch((error) => {
        logger.warn({ err: error }, 'Failed to persist telemetry event to Redis');
      });
  });
}

function parseStreamEntries(entries: Array<[string, string[]]>): TelemetryEvent[] {
  const result: TelemetryEvent[] = [];
  for (const [id, fields] of entries) {
    for (let i = 0; i < fields.length; i += 2) {
      const key = fields[i];
      const value = fields[i + 1];
      if (key !== 'event' || typeof value !== 'string') {
        continue;
      }
      try {
        const parsed = JSON.parse(value) as TelemetryEvent;
        parsed.id = id;
        parsed.timestamp = parsed.timestamp ?? new Date().toISOString();
        result.push(parsed);
      } catch (error) {
        logger.debug({ err: error, value }, 'Failed to parse telemetry event payload');
      }
    }
  }
  return result;
}

export async function getTelemetryHistory(options: {
  limit?: number;
  afterId?: string;
} = {}): Promise<TelemetryEvent[]> {
  const limit = Math.max(options.limit ?? env.TELEMETRY_HISTORY_LIMIT, 1);

  if (!env.TELEMETRY_ENABLED) {
    const history = telemetryEventBus.getHistory();
    if (options.afterId) {
      const index = history.findIndex((item) => item.id === options.afterId);
      return index >= 0 ? history.slice(index + 1) : history.slice(-limit);
    }
    return history.slice(-limit);
  }

  try {
    let entries: Array<[string, string[]]>;
    if (options.afterId) {
      entries = await redis.xrange(STREAM, `(${options.afterId}`, '+', 'COUNT', limit);
    } else {
      entries = await redis.xrevrange(STREAM, '+', '-', 'COUNT', limit);
      entries.reverse();
    }
    const events = parseStreamEntries(entries);
    if (!events.length) {
      return telemetryEventBus.getHistory().slice(-limit);
    }
    return events.slice(-limit);
  } catch (error) {
    logger.warn({ err: error }, 'Failed to read telemetry history from Redis');
    const history = telemetryEventBus.getHistory();
    if (options.afterId) {
      const index = history.findIndex((item) => item.id === options.afterId);
      return index >= 0 ? history.slice(index + 1) : history.slice(-limit);
    }
    return history.slice(-limit);
  }
}
