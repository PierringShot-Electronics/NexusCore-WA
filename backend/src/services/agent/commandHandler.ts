const STOP_COMMANDS = new Set(['stop', 'pause', 'human', 'operator', 'menecer']);
const START_COMMANDS = new Set(['start', 'resume', 'reset']);

export type CommandType = 'stop' | 'start' | null;

export function detectCommand(text: string | undefined): CommandType {
  if (!text) {
    return null;
  }

  const normalized = text.trim().toLowerCase();

  if (STOP_COMMANDS.has(normalized)) {
    return 'stop';
  }

  if (START_COMMANDS.has(normalized)) {
    return 'start';
  }

  return null;
}
