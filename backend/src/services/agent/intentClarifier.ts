import path from 'node:path';
import fs from 'node:fs';

interface IntentEntry {
  id: string;
  label?: string;
  examples: string[];
  confidence?: number;
}

interface IntentMap {
  intents: IntentEntry[];
  fallback?: {
    default_intent?: string;
    clarify_threshold?: number;
    clarify_template?: string;
  };
}

interface ClarificationResult {
  prompt: string;
  options: string[];
}

const INTENT_MAP_PATH = path.join(process.cwd(), 'data', 'intent_map.json');

let cachedConfig: IntentMap | null = null;
let cachedMtime = 0;

function loadIntentMap(): IntentMap {
  try {
    const stats = fs.statSync(INTENT_MAP_PATH);
    if (cachedConfig && cachedMtime === stats.mtimeMs) {
      return cachedConfig;
    }

    const raw = fs.readFileSync(INTENT_MAP_PATH, 'utf8');
    const parsed = JSON.parse(raw) as IntentMap;
    cachedConfig = parsed;
    cachedMtime = stats.mtimeMs;
    return parsed;
  } catch {
    return {
      intents: [],
      fallback: {
        clarify_threshold: 0.35,
        clarify_template:
          'Dəqiq yardım üçün təsdiqləyin: {options} mövzusunda soruşursunuz, yoxsa başqa mövzu var?'
      }
    };
  }
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9əöğüçış]+/iu)
    .filter((token) => token.length > 1);
}

function scoreIntent(tokens: string[], intent: IntentEntry): number {
  if (!intent.examples?.length) {
    return 0;
  }

  let bestScore = 0;
  for (const example of intent.examples) {
    const exampleTokens = tokenize(example);
    if (!exampleTokens.length) {
      continue;
    }
    const matches = exampleTokens.filter((token) => tokens.includes(token)).length;
    if (!matches) {
      continue;
    }
    const ratio = matches / exampleTokens.length;
    if (ratio > bestScore) {
      bestScore = ratio;
    }
  }

  const confidence = typeof intent.confidence === 'number' ? intent.confidence : 0.5;
  return Number((bestScore * confidence).toFixed(3));
}

export function buildClarification(
  message: string
): ClarificationResult | null {
  const config = loadIntentMap();
  const tokens = tokenize(message);

  const scored = (config.intents ?? []).map((intent) => ({
    intent,
    score: scoreIntent(tokens, intent)
  }));

  scored.sort((a, b) => b.score - a.score);

  const threshold =
    typeof config.fallback?.clarify_threshold === 'number'
      ? config.fallback?.clarify_threshold
      : 0.35;

  const topScore = scored[0]?.score ?? 0;
  const needsClarification = tokens.length === 0 || !scored.length || topScore < threshold;

  const topCandidate = scored[0];

  if (!needsClarification && topCandidate?.intent) {
    const best = topCandidate.intent;
    const label = best.label ?? best.id.replace(/_/g, ' ');
    const template =
      config.fallback?.clarify_template ??
      'Dəqiq yardım üçün təsdiqləyin: {options} mövzusunda soruşursunuz, yoxsa başqa mövzu var?';
    return {
      options: [label],
      prompt: template.replace('{options}', label)
    };
  }

  const topOptions = scored
    .slice(0, 3)
    .map((entry) => entry.intent.label ?? entry.intent.id.replace(/_/g, ' '));

  if (!topOptions.length) {
    const fallbackLabel = 'satış, texniki dəstək və ya təmir';
    const template =
      config.fallback?.clarify_template ??
      'Dəqiq yardım üçün təsdiqləyin: {options} mövzusunda soruşursunuz, yoxsa başqa mövzu var?';
    return {
      options: [fallbackLabel],
      prompt: template.replace('{options}', fallbackLabel)
    };
  }

  const template =
    config.fallback?.clarify_template ??
    'Dəqiq yardım üçün təsdiqləyin: {options} mövzusunda soruşursunuz, yoxsa başqa mövzu var?';

  const optionsDisplay = topOptions
    .map((option, index) => `${index + 1}) ${option}`)
    .join(', ');

  return {
    options: topOptions,
    prompt: template.replace('{options}', optionsDisplay)
  };
}
