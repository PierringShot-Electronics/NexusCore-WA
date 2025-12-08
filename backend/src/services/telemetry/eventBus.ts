import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import { env } from '../../config/env';

export type TelemetryStage =
  | 'buffer'
  | 'intent'
  | 'persona'
  | 'tools'
  | 'response'
  | 'send';

export type TelemetryStatus = 'success' | 'error';

export interface TelemetryEvent {
  id: string;
  chatId: string;
  stage: TelemetryStage;
  status: TelemetryStatus;
  timestamp: string;
  durationMs?: number;
  persona?: string;
  model?: string;
  meta?: Record<string, unknown>;
}

type TelemetryListener = (event: TelemetryEvent) => void;

const EVENT_NAME = 'telemetry.event';

class TelemetryEventBus {
  private readonly emitter: EventEmitter;
  private readonly history: TelemetryEvent[] = [];
  private readonly historyLimit: number;

  constructor(historyLimit = 200) {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.historyLimit = historyLimit;
  }

  public emit(
    event: Omit<TelemetryEvent, 'id' | 'timestamp'> & {
      id?: string;
      timestamp?: string;
    }
  ): TelemetryEvent {
    const payload: TelemetryEvent = {
      ...event,
      id: event.id ?? randomUUID(),
      timestamp: event.timestamp ?? new Date().toISOString()
    };

    this.history.push(payload);
    if (this.history.length > this.historyLimit) {
      this.history.splice(0, this.history.length - this.historyLimit);
    }

    this.emitter.emit(EVENT_NAME, payload);
    return payload;
  }

  public on(listener: TelemetryListener): () => void {
    this.emitter.on(EVENT_NAME, listener);
    return () => {
      this.emitter.off(EVENT_NAME, listener);
    };
  }

  public once(listener: TelemetryListener): void {
    this.emitter.once(EVENT_NAME, listener);
  }

  public getHistory(): TelemetryEvent[] {
    return [...this.history];
  }
}

export const telemetryEventBus = new TelemetryEventBus(env.TELEMETRY_HISTORY_LIMIT);
