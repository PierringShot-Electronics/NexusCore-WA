import { existsSync, readFileSync } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'dotenv';

interface EnvVariableMetadata {
  key: string;
  label: string;
  description?: string;
  secret?: boolean;
}

export interface EnvVariableEntry extends EnvVariableMetadata {
  value: string;
}

interface UpdatePayload {
  key: string;
  value: string;
}

const ENV_FILENAME = '.env';

const ENV_CANDIDATES = [
  path.join(process.cwd(), ENV_FILENAME),
  path.join(process.cwd(), '..', ENV_FILENAME),
  path.join(process.cwd(), '..', 'backend', ENV_FILENAME)
];

const FALLBACK_ENV_PATH = path.join(process.cwd(), 'data', 'admin-managed.env');

const ENV_METADATA: EnvVariableMetadata[] = [
  {
    key: 'OPENAI_API_KEY',
    label: 'OpenAI API Key',
    description: 'Secure key for OpenAI Chat, Vision, and Whisper requests.',
    secret: true
  },
  {
    key: 'OPENAI_MODEL',
    label: 'OpenAI Default Model',
    description: 'Primary text/agent model (default gpt-4o-mini).'
  },
  {
    key: 'OPENAI_VISION_MODEL',
    label: 'OpenAI Vision Model',
    description: 'Used for multimodal reasoning when images or video are involved (default gpt-4o).'
  },
  {
    key: 'OPENAI_TRANSCRIPTION_MODEL',
    label: 'OpenAI Transcription Model',
    description: 'Audio-to-text transcription engine (default whisper-1).'
  },
  {
    key: 'OPENAI_EMBEDDING_MODEL',
    label: 'OpenAI Embedding Model',
    description: 'Vector embedding model for product similarity search.'
  },
  {
    key: 'OPENAI_ROUTER_MODEL',
    label: 'OpenAI Router Model',
    description: 'Lightweight model for intent routing (default gpt-4o-mini).'
  },
  {
    key: 'OPENAI_TTS_MODEL',
    label: 'OpenAI TTS Model',
    description: 'Text-to-speech model identifier (məs: tts-1).'
  },
  {
    key: 'OPENAI_TTS_VOICE',
    label: 'OpenAI TTS Voice',
    description: 'Seçilmiş səs (məs: alloy).'
  },
  {
    key: 'GROQ_API_KEY',
    label: 'Groq API Key',
    description: 'Optional fallback completion key; keep safe.',
    secret: true
  },
  {
    key: 'GROQ_ROUTER_MODEL',
    label: 'Groq Router Model',
    description: 'Routing model for intent classification.'
  },
  {
    key: 'GROQ_COMPLETION_MODEL',
    label: 'Groq Completion Model',
    description: 'Fallback text completion model.'
  },
  {
    key: 'GROQ_VISION_MODEL',
    label: 'Groq Vision Model',
    description: 'Alternative multimodal model for image reasoning.'
  },
  {
    key: 'GROQ_TRANSCRIPTION_MODEL',
    label: 'Groq Transcription Model',
    description: 'Alternative transcription model (defaults to Whisper).'
  },
  {
    key: 'AGENT_MODEL_GENERAL',
    label: 'Agent Model – General',
    description: 'Ümumi dialoq üçün baza modeli (default gpt-4o-mini).'
  },
  {
    key: 'AGENT_MODEL_SALES',
    label: 'Agent Model – Sales',
    description: 'Satış/persona cavabları üçün model (default gpt-4o).'
  },
  {
    key: 'AGENT_MODEL_SUPPORT',
    label: 'Agent Model – Support',
    description: 'Şikayət/ dəstək cavabları üçün model (default gpt-4o-mini).'
  },
  {
    key: 'AGENT_MODEL_DIAGNOSTICS',
    label: 'Agent Model – Diagnostics',
    description: 'Multimodal texniki diaqnostika üçün model (default gpt-4o).'
  },
  {
    key: 'WHATSAPP_GATEWAY_BASE_URL',
    label: 'WhatsApp Gateway Base URL',
    description: 'Base URL for the in-house WhatsApp gateway (e.g. http://wweb:3001).'
  },
  {
    key: 'WHATSAPP_GATEWAY_SESSION',
    label: 'WhatsApp Gateway Session',
    description: 'Session identifier for WhatsApp Web authentication.'
  },
  {
    key: 'BUFFER_TIMEOUT_MS',
    label: 'Buffer Timeout (ms)',
    description: 'Batch window before agent processes collected messages.'
  },
  {
    key: 'TOOL_TAPAZ_BASE_URL',
    label: 'Tap.az Tool Base URL',
    description: 'Base URL for competitor price lookups.'
  },
  {
    key: 'DEFAULT_LOCALE',
    label: 'Default Locale',
    description: 'Fallback locale for agent responses.'
  },
  {
    key: 'BUSINESS_RULES_PATH',
    label: 'Business Prompt Path',
    description: 'Filesystem path for biznes.md prompt file.'
  }
];

type EnvLine =
  | { type: 'comment'; raw: string }
  | { type: 'blank'; raw: string }
  | { type: 'assignment'; raw: string; key: string; value: string }
  | { type: 'unknown'; raw: string };

let envPath = resolveInitialEnvPath();

function resolveInitialEnvPath(): string | null {
  for (const candidate of ENV_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function ensureEnvDir(targetPath: string): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
}

function readCurrentEnvFile(): string {
  if (envPath && existsSync(envPath)) {
    return readFileSync(envPath, 'utf-8');
  }

  if (existsSync(FALLBACK_ENV_PATH)) {
    if (!envPath) {
      envPath = FALLBACK_ENV_PATH;
    }
    return readFileSync(FALLBACK_ENV_PATH, 'utf-8');
  }

  return '';
}

function parseEnvDocument(contents: string): { lines: EnvLine[]; values: Record<string, string> } {
  const lines = contents.split(/\r?\n/);
  const parsedLines: EnvLine[] = lines.map((raw) => {
    if (raw.trim().length === 0) {
      return { type: 'blank', raw };
    }
    if (raw.trim().startsWith('#')) {
      return { type: 'comment', raw };
    }
    const match = raw.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1] ?? '';
      const valuePart = match[2] ?? '';
      if (key.length > 0) {
        return { type: 'assignment', raw, key, value: valuePart };
      }
    }
    return { type: 'unknown', raw };
  });

  const values = parse(contents);
  return { lines: parsedLines, values };
}

function formatEnvAssignment(key: string, value: string): string {
  if (value === '') {
    return `${key}=`;
  }
  if (/[#\s"'\\]/.test(value)) {
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `${key}="${escaped}"`;
  }
  return `${key}=${value}`;
}

export function getEnvFilePath(): string {
  return envPath ?? FALLBACK_ENV_PATH;
}

export async function getEditableEnvEntries(): Promise<EnvVariableEntry[]> {
  const contents = readCurrentEnvFile();
  const { values } = parseEnvDocument(contents);

  return ENV_METADATA.map((meta) => ({
    ...meta,
    value: values[meta.key] ?? process.env[meta.key] ?? ''
  }));
}

export async function getEnvMetadata(): Promise<{ path: string; updatedAt: string | null }> {
  const target = envPath ?? FALLBACK_ENV_PATH;
  try {
    const stats = await stat(target);
    return {
      path: target,
      updatedAt: stats.mtime.toISOString()
    };
  } catch {
    return {
      path: target,
      updatedAt: null
    };
  }
}

export async function updateEditableEnv(entries: UpdatePayload[]): Promise<EnvVariableEntry[]> {
  const allowedKeys = new Set(ENV_METADATA.map((meta) => meta.key));
  for (const entry of entries) {
    if (!allowedKeys.has(entry.key)) {
      throw new Error(`Unsupported env variable: ${entry.key}`);
    }
  }

  const contents = readCurrentEnvFile();
  const { lines } = parseEnvDocument(contents);
  const pending = new Map(entries.map((entry) => [entry.key, entry.value]));

  const updatedLines = lines.map((line) => {
    if (line.type !== 'assignment') {
      return line;
    }
    if (!pending.has(line.key)) {
      return line;
    }
    const nextValue = pending.get(line.key) ?? '';
    pending.delete(line.key);
    const normalized = formatEnvAssignment(line.key, nextValue);
    return { type: 'assignment', raw: normalized, key: line.key, value: nextValue };
  });

  for (const [key, value] of pending.entries()) {
    updatedLines.push({
      type: 'assignment',
      raw: formatEnvAssignment(key, value),
      key,
      value
    });
  }

  if (!envPath) {
    envPath = FALLBACK_ENV_PATH;
  }

  await ensureEnvDir(envPath);
  const serialized = updatedLines.map((line) => line.raw).join('\n');
  await writeFile(envPath, `${serialized.trimEnd()}\n`, 'utf-8');

  for (const entry of entries) {
    process.env[entry.key] = entry.value;
  }

  return getEditableEnvEntries();
}
