import { redis } from '../../db/redis';
import { telemetryEventBus } from './eventBus';
import { calculateCost, resolvePricing, type CostComponents } from '../../config/modelPricing';

const COST_TOTALS_KEY = 'telemetry:cost:totals';

export interface UsageRecord {
  chatId: string;
  provider: string;
  model: string;
  usage: CostComponents;
}

export async function recordModelUsage(record: UsageRecord): Promise<void> {
  const provider = record.provider.toLowerCase();
  const model = record.model.toLowerCase();
  const pricing = resolvePricing(provider, model);
  const cost = calculateCost(pricing, record.usage);

  telemetryEventBus.emit({
    chatId: record.chatId,
    stage: 'cost',
    status: 'success',
    persona: undefined,
    model,
    durationMs: undefined,
    meta: {
      provider,
      model,
      usage: record.usage,
      cost,
      currency: pricing.currency
    }
  });

  if (cost === 0) {
    return;
  }

  const hashKey = `${provider}:${model}`;
  await redis.hincrbyfloat(COST_TOTALS_KEY, hashKey, cost);
}

export async function getCostTotals(): Promise<Record<string, number>> {
  const entries = await redis.hgetall(COST_TOTALS_KEY);
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(entries)) {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      result[key] = numeric;
    }
  }
  return result;
}
