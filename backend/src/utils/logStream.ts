import { EventEmitter } from 'node:events';

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  time: string;
  details?: unknown;
}

const logEmitter = new EventEmitter();
const MAX_HISTORY = 200;
const history: LogEntry[] = [];

export function publishLog(entry: LogEntry): void {
  history.push(entry);
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  logEmitter.emit('log', entry);
}

export function getLogHistory(): LogEntry[] {
  return [...history];
}

export function subscribeLogs(listener: (entry: LogEntry) => void): () => void {
  logEmitter.on('log', listener);
  return () => {
    logEmitter.off('log', listener);
  };
}
