import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

let cachedPrompt: string | null = null;
let cachedPath: string | null = null;

export async function loadBusinessPrompt(): Promise<string> {
  const candidatePaths = [
    env.BUSINESS_RULES_PATH,
    path.join(process.cwd(), env.BUSINESS_RULES_PATH),
    path.join(process.cwd(), '../docs/biznes.md')
  ];

  for (const candidate of candidatePaths) {
    if (!candidate) continue;
    const resolved = path.isAbsolute(candidate)
      ? candidate
      : path.join(process.cwd(), candidate);

    if (cachedPrompt && cachedPath === resolved) {
      return cachedPrompt;
    }

    try {
      const fileContents = await readFile(resolved, 'utf-8');
      cachedPrompt = fileContents;
      cachedPath = resolved;
      return fileContents;
    } catch (error) {
      logger.warn({ err: error, candidate: resolved }, 'Prompt candidate failed');
    }
  }

  logger.error('Failed to load business rules prompt. Using fallback.');
  return 'You are PierringShot AI. Respond professionally.';
}
