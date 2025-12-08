import { env } from './env';

export type CostComponents = {
  promptTokens?: number;
  completionTokens?: number;
  cachedTokens?: number;
};

export type PricingBreakdown = {
  provider: string;
  model: string;
  promptRate: number;
  completionRate: number;
  cachedRate: number;
  currency: string;
};

type PricingTable = Record<string, Record<string, Partial<PricingBreakdown>>>;

const DEFAULT_PRICING: PricingTable = {
  openai: {
    'gpt-4o': {
      promptRate: 0.005,
      completionRate: 0.015,
      cachedRate: 0,
      currency: 'USD'
    },
    'gpt-4o-mini': {
      promptRate: 0.00015,
      completionRate: 0.0006,
      cachedRate: 0,
      currency: 'USD'
    },
    'gpt-4o-mini-transcribe': {
      promptRate: 0.0001,
      completionRate: 0,
      cachedRate: 0,
      currency: 'USD'
    },
    'gpt-4o-realtime-preview': {
      promptRate: 0.00125,
      completionRate: 0.005,
      cachedRate: 0,
      currency: 'USD'
    }
  },
  groq: {
    'llama-3.1-70b-versatile': {
      promptRate: 0.00059,
      completionRate: 0.00079,
      cachedRate: 0,
      currency: 'USD'
    },
    'llama-3.1-8b-instant': {
      promptRate: 0.00005,
      completionRate: 0.00008,
      cachedRate: 0,
      currency: 'USD'
    },
    'whisper-large-v3-turbo': {
      promptRate: 0.0001,
      completionRate: 0,
      cachedRate: 0,
      currency: 'USD'
    }
  }
};

let overrides: PricingTable | null = null;

function loadOverrides(): PricingTable | null {
  if (!env.MODEL_PRICING_OVERRIDES) {
    return null;
  }

  if (overrides) {
    return overrides;
  }

  try {
    overrides = JSON.parse(env.MODEL_PRICING_OVERRIDES) as PricingTable;
    return overrides;
  } catch (error) {
    console.warn('MODEL_PRICING_OVERRIDES is not valid JSON, ignoring overrides.', error);
    overrides = null;
    return null;
  }
}

export function resolvePricing(providerRaw: string, modelRaw: string): PricingBreakdown {
  const provider = providerRaw.toLowerCase();
  const model = modelRaw.toLowerCase();
  const overrideTable = loadOverrides();

  const fallback: PricingBreakdown = {
    provider,
    model,
    promptRate: 0,
    completionRate: 0,
    cachedRate: 0,
    currency: 'USD'
  };

  const table = overrideTable?.[provider] ?? DEFAULT_PRICING[provider];
  if (!table) {
    return fallback;
  }

  const direct = table[model];
  if (!direct) {
    return fallback;
  }

  return {
    ...fallback,
    ...direct
  };
}

export function calculateCost(breakdown: PricingBreakdown, usage: CostComponents): number {
  const { promptTokens = 0, completionTokens = 0, cachedTokens = 0 } = usage;
  const promptCost = (promptTokens / 1000) * breakdown.promptRate;
  const completionCost = (completionTokens / 1000) * breakdown.completionRate;
  const cachedCost = (cachedTokens / 1000) * breakdown.cachedRate;

  return Number((promptCost + completionCost + cachedCost).toFixed(6));
}
