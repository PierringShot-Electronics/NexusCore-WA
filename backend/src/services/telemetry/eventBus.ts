import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import { env } from '../../config/env';

export type TelemetryStage =
  | 'buffer'
  | 'intent'
  | 'persona'
  | 'tools'
  | 'response'
  | 'send'
  | 'cost';

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

class TelemetryEventBus {
  private readonly emitter = new EventEmitter();
  private readonly history: TelemetryEvent[] = [];
  private readonly historyLimit: number;

  constructor(historyLimit: number) {
    this.emitter.setMaxListeners(0);
    this.historyLimit = historyLimit;
  }

  public emit(event: Omit<TelemetryEvent, 'id' | 'timestamp'> & Partial<Pick<TelemetryEvent, 'id' | 'timestamp'>>): TelemetryEvent {
    const payload: TelemetryEvent = {
      ...event,
      id: event.id ?? randomUUID(),
      timestamp: event.timestamp ?? new Date().toISOString()
    };

    this.history.push(payload);
    if (this.history.length > this.historyLimit) {
      this.history.splice(0, this.history.length - this.historyLimit);
    }

    this.emitter.emit('telemetry.event', payload);
    return payload;
  }

  public on(listener: TelemetryListener): () => void {
    this.emitter.on('telemetry.event', listener);
    return () => this.emitter.off('telemetry.event', listener);
  }

  public getHistory(): TelemetryEvent[] {
    return [...this.history];
  }
}

export const telemetryEventBus = new TelemetryEventBus(env.TELEMETRY_HISTORY_LIMIT);
