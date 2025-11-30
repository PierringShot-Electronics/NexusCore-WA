import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

let cachedPrompt: string | null = null;
let cachedPath: string | null = null;

const PROMPT_CANDIDATES = [
  env.BUSINESS_RULES_PATH,
  path.join(process.cwd(), env.BUSINESS_RULES_PATH),
  path.join(process.cwd(), '../data/biznes.md'),
  path.join(process.cwd(), '../docs/biznes.md')
];

async function resolvePrompt(): Promise<{ path: string; content: string }> {
  for (const candidate of PROMPT_CANDIDATES) {
    if (!candidate) continue;
    const resolved = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);

    try {
      if (cachedPrompt && cachedPath === resolved) {
        return { path: cachedPath, content: cachedPrompt };
      }

      const fileContents = await readFile(resolved, 'utf-8');
      cachedPrompt = fileContents;
      cachedPath = resolved;
      return { path: resolved, content: fileContents };
    } catch (error) {
      logger.warn({ err: error, candidate: resolved }, 'Prompt candidate failed');
    }
  }

  logger.error('Failed to load business rules prompt. Using fallback.');
  return {
    path: PROMPT_CANDIDATES[PROMPT_CANDIDATES.length - 1] ?? 'biznes.md',
    content: 'You are PierringShot AI. Respond professionally.'
  };
}

export async function loadBusinessPrompt(): Promise<string> {
  const { content } = await resolvePrompt();
  return content;
}

export async function getBusinessPromptInfo(): Promise<{
  path: string;
  content: string;
  updatedAt: string | null;
}> {
  const { path: promptPath, content } = await resolvePrompt();
  try {
    const stats = await stat(promptPath);
    return {
      path: promptPath,
      content,
      updatedAt: stats.mtime.toISOString()
    };
  } catch {
    return {
      path: promptPath,
      content,
      updatedAt: null
    };
  }
}

export async function writeBusinessPrompt(nextContent: string): Promise<{
  path: string;
  updatedAt: string | null;
}> {
  const { path: promptPath } = await resolvePrompt();
  await writeFile(promptPath, `${nextContent.trimEnd()}\n`, 'utf-8');
  cachedPrompt = nextContent;
  cachedPath = promptPath;
  try {
    const stats = await stat(promptPath);
    return { path: promptPath, updatedAt: stats.mtime.toISOString() };
  } catch {
    return { path: promptPath, updatedAt: null };
  }
}

export function invalidatePromptCache(): void {
  cachedPrompt = null;
  cachedPath = null;
}

export function getCachedPromptPath(): string | null {
  return cachedPath;
}
