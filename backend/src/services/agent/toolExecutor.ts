import { lookupInternalStock } from '../tools/internalStock';
import { searchCompetitors } from '../tools/competitorSearch';
import { calculateOffer } from '../tools/pricing';
import { analyzeImage } from '../tools/imageAnalysis';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import type { VisionInsight } from '../tools/imageAnalysis';
import { getAgentConfig } from '../../config/agentConfig';

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

export interface VisionSummaryEntry extends VisionInsight {
  imageUrl: string;
  index: number;
}

export interface ToolSummary {
  stock?: Awaited<ReturnType<typeof lookupInternalStock>>;
  competitors?: Awaited<ReturnType<typeof searchCompetitors>>;
  pricing?: ReturnType<typeof calculateOffer>;
  vision?: VisionSummaryEntry[];
}

export async function executeTools(
  decision: ToolDecision,
  context: ToolContext
): Promise<ToolSummary> {
  const results: ToolSummary = {};

  if (decision.needsVision) {
    const imageLimit = Math.max(1, getAgentConfig().vision.maxImagesToProcess);
    const imageMessages = context.buffered.filter(
      (msg): msg is BufferedMessagePayload & { imageUrl: string } =>
        msg.type === 'image' && typeof msg.imageUrl === 'string'
    );

    const insights: VisionSummaryEntry[] = [];
    for (const [index, message] of imageMessages.slice(0, imageLimit).entries()) {
      const insight = await analyzeImage(message.imageUrl);
      if (insight) {
        insights.push({ ...insight, imageUrl: message.imageUrl, index });
      }
    }

    if (insights.length) {
      results.vision = insights;
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
