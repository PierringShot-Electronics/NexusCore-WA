import { lookupInternalStock } from '../tools/internalStock';
import { searchCompetitors } from '../tools/competitorSearch';
import { calculateOffer } from '../tools/pricing';
import { analyzeImage } from '../tools/imageAnalysis';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';

export interface ToolContext {
  userMessage: string;
  buffered: BufferedMessagePayload[];
}

export interface ToolDecision {
  needsStock: boolean;
  needsCompetitors: boolean;
  needsPricing: boolean;
  needsVision: boolean;
}

export interface ToolSummary {
  stock?: Awaited<ReturnType<typeof lookupInternalStock>>;
  competitors?: Awaited<ReturnType<typeof searchCompetitors>>;
  pricing?: ReturnType<typeof calculateOffer>;
  vision?: Awaited<ReturnType<typeof analyzeImage>>;
}

export async function executeTools(
  decision: ToolDecision,
  context: ToolContext
): Promise<ToolSummary> {
  const results: ToolSummary = {};

  if (decision.needsVision) {
    const firstImage = context.buffered.find((msg) => msg.type === 'image');
    if (firstImage?.imageUrl) {
      results.vision = await analyzeImage(firstImage.imageUrl);
    }
  }

  let stockResult;
  if (decision.needsStock) {
    stockResult = await lookupInternalStock(context.userMessage);
    results.stock = stockResult;
  }

  let competitorResult;
  if (decision.needsCompetitors) {
    competitorResult = await searchCompetitors(context.userMessage);
    results.competitors = competitorResult;
  }

  if (decision.needsPricing) {
    const internalCost = stockResult?.matches?.[0]?.cost ?? null;
    const competitorPrice = competitorResult?.offers?.[0]?.price ?? null;
    results.pricing = calculateOffer({
      internalCost,
      competitorPrice
    });
  }

  return results;
}
