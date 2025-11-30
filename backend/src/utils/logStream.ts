import { EventEmitter } from 'node:events';
import { getAgentConfig, onAgentConfigChange } from '../config/agentConfig';

export interface LogEntry {
  id: string;
  level: string;
  message: string;
  time: string;
  details?: unknown;
}

const logEmitter = new EventEmitter();
const history: LogEntry[] = [];
let historyLimit = getAgentConfig().logs.historyLimit;

function enforceHistoryLimit(): void {
  while (history.length > historyLimit) {
    history.shift();
  }
}

onAgentConfigChange((config) => {
  historyLimit = config.logs.historyLimit;
  enforceHistoryLimit();
});

export function publishLog(entry: LogEntry): void {
  history.push(entry);
  enforceHistoryLimit();
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
