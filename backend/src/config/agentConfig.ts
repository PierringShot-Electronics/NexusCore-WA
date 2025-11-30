import { existsSync, readFileSync } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const CONFIG_FILENAME = 'agent-config.json';

const CONFIG_CANDIDATES = [
  path.join(process.cwd(), CONFIG_FILENAME),
  path.join(process.cwd(), 'config', CONFIG_FILENAME),
  path.join(process.cwd(), '..', 'data', CONFIG_FILENAME),
  path.join(process.cwd(), '..', CONFIG_FILENAME)
];

const AgentConfigSchema = z.object({
  heuristics: z.object({
    greetingPatterns: z.array(z.string()).default(['^s[aə]lam!?$', '^h(e|ə)y!?$', '^nec[əe]s[əe]n\\??$']),
    manualHandoverKeywords: z
      .array(z.string())
      .default(['insan', 'operator', 'menecer', 'human', 'real adam']),
    productPatterns: z
      .array(z.string())
      .default(['məhsul', 'varm[ıi]', 'stok', 'sat[ıi]l[ıi]r', 'əlində nə var', 'modellər']),
    pricingPatterns: z.array(z.string()).default(['neçəyə', 'qiymət', 'price', 'kaç']),
    competitorPatterns: z.array(z.string()).default(['başqa yerdə', 'tap\\.az', 'rəqib', 'ucuz']),
    repairPatterns: z
      .array(z.string())
      .default(['təmir', 'servis', 'termopasta', 'fan', 'ekran', 'batareya', 'adapter', 'toz', 'qızır', 'soyutma']),
    supportPatterns: z
      .array(z.string())
      .default(['şikayət', 'naraz', 'qaranti', 'zəmanət', 'yenə', 'problem', 'işləmir', 'gəlməyib', 'söndü', 'yanır']),
    salesPatterns: z
      .array(z.string())
      .default(['qiymət', 'neçə', 'satılır', 'varmı', 'stok', 'almaq', 'sifariş'])
  }),
  vision: z.object({
    maxImagesToProcess: z.number().int().min(1).max(10).default(3)
  }),
  logs: z.object({
    historyLimit: z.number().int().min(50).max(1000).default(200)
  })
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[K];
};

const AgentConfigUpdateSchema = z.object({
  heuristics: z
    .object({
      greetingPatterns: z.array(z.string()).optional(),
      manualHandoverKeywords: z.array(z.string()).optional(),
      productPatterns: z.array(z.string()).optional(),
      pricingPatterns: z.array(z.string()).optional(),
      competitorPatterns: z.array(z.string()).optional(),
      repairPatterns: z.array(z.string()).optional(),
      supportPatterns: z.array(z.string()).optional(),
      salesPatterns: z.array(z.string()).optional()
    })
    .partial()
    .optional(),
  vision: z
    .object({
      maxImagesToProcess: z.number().int().min(1).max(10)
    })
    .partial()
    .optional(),
  logs: z
    .object({
      historyLimit: z.number().int().min(50).max(1000)
    })
    .partial()
    .optional()
});

export type AgentConfigUpdate = z.infer<typeof AgentConfigUpdateSchema>;

const DEFAULT_AGENT_CONFIG: AgentConfig = AgentConfigSchema.parse({});

type AgentHeuristicMatchers = {
  greeting: RegExp[];
  manualHandover: RegExp[];
  product: RegExp[];
  pricing: RegExp[];
  competitor: RegExp[];
  repair: RegExp[];
  support: RegExp[];
  sales: RegExp[];
};

let configPath = resolveInitialConfigPath();
let agentConfig = loadInitialConfig();
let heuristicMatchers = buildHeuristicMatchers(agentConfig);

type ConfigListener = (config: AgentConfig) => void;
const listeners = new Set<ConfigListener>();

function resolveInitialConfigPath(): string {
  for (const candidate of CONFIG_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return CONFIG_CANDIDATES[2] ?? path.join(process.cwd(), '..', 'data', CONFIG_FILENAME);
}

async function ensureDirectoryExists(targetPath: string): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
}

function loadInitialConfig(): AgentConfig {
  try {
    if (existsSync(configPath)) {
      const raw = readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(raw) as DeepPartial<AgentConfig>;
      const merged = deepMerge(structuredClone(DEFAULT_AGENT_CONFIG), parsed);
      return AgentConfigSchema.parse(merged);
    }
  } catch (error) {
    console.warn('[agent-config] Failed to read config file, using defaults:', error);
  }
  return structuredClone(DEFAULT_AGENT_CONFIG);
}

function deepMerge<T>(base: T, updates?: DeepPartial<T>): T {
  if (!updates) {
    return base;
  }

  if (Array.isArray(base)) {
    if (Array.isArray(updates)) {
      return updates as unknown as T;
    }
    return base;
  }

  if (typeof base === 'object' && base !== null) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(updates as Record<string, unknown>)) {
      if (value === undefined) continue;
      const current = (result as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        result[key] = value;
      } else if (isPlainObject(value) && isPlainObject(current)) {
        result[key] = deepMerge(current, value as DeepPartial<typeof current>);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }

  return updates as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildHeuristicMatchers(config: AgentConfig): AgentHeuristicMatchers {
  return {
    greeting: config.heuristics.greetingPatterns.map(buildRegex),
    manualHandover: config.heuristics.manualHandoverKeywords.map(buildRegex),
    product: config.heuristics.productPatterns.map(buildRegex),
    pricing: config.heuristics.pricingPatterns.map(buildRegex),
    competitor: config.heuristics.competitorPatterns.map(buildRegex),
    repair: config.heuristics.repairPatterns.map(buildRegex),
    support: config.heuristics.supportPatterns.map(buildRegex),
    sales: config.heuristics.salesPatterns.map(buildRegex)
  };
}

function buildRegex(pattern: string): RegExp {
  try {
    return new RegExp(pattern, 'i');
  } catch {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  }
}

async function persistConfig(nextConfig: AgentConfig): Promise<void> {
  await ensureDirectoryExists(configPath);
  await writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf-8');
}

function notifyListeners(nextConfig: AgentConfig): void {
  for (const listener of listeners) {
    try {
      listener(nextConfig);
    } catch (error) {
      console.warn('[agent-config] Listener error:', error);
    }
  }
}

export function getAgentConfig(): AgentConfig {
  return agentConfig;
}

export function getAgentConfigPath(): string {
  return configPath;
}

export function getAgentHeuristicMatchers(): AgentHeuristicMatchers {
  return heuristicMatchers;
}

export async function reloadAgentConfig(): Promise<AgentConfig> {
  const fresh = loadInitialConfig();
  agentConfig = fresh;
  heuristicMatchers = buildHeuristicMatchers(agentConfig);
  await persistConfig(agentConfig);
  notifyListeners(agentConfig);
  return agentConfig;
}

export async function updateAgentConfig(update: AgentConfigUpdate): Promise<AgentConfig> {
  const parsedUpdate = AgentConfigUpdateSchema.parse(update);
  const merged = deepMerge(structuredClone(agentConfig), parsedUpdate);
  const validated = AgentConfigSchema.parse(merged);
  agentConfig = validated;
  heuristicMatchers = buildHeuristicMatchers(agentConfig);
  await persistConfig(agentConfig);
  notifyListeners(agentConfig);
  return agentConfig;
}

export function parseAgentConfigUpdate(input: unknown): AgentConfigUpdate {
  return AgentConfigUpdateSchema.parse(input);
}

export function onAgentConfigChange(listener: ConfigListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function getAgentConfigMetadata(): Promise<{
  path: string;
  updatedAt: string | null;
}> {
  try {
    const stats = await stat(configPath);
    return {
      path: configPath,
      updatedAt: stats.mtime.toISOString()
    };
  } catch {
    return {
      path: configPath,
      updatedAt: null
    };
  }
}
