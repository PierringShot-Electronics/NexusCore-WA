import { openaiClient, hasOpenAI, groqClient, hasGroq } from '../../config/ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface VisionInsight {
  summary: string;
  probableModel?: string;
  damageNotes?: string;
  ocrText?: string;
}

export async function analyzeImage(url: string): Promise<VisionInsight | null> {
  const instructions =
    'Sən PierringShot Electronics üçün texniki analiz mütəxəssisisən. ' +
    'Aşağıdakı JSON formatında cavab ver: {"summary": string, "probableModel"?: string, "damageNotes"?: string, "ocrText"?: string}. ' +
    'Summary sahəsində 2-3 cümlə ilə cihazın vəziyyətini izah et. ProbableModel varsa model adını yaz. DamageNotes bölməsində görünən zədələri qeyd et. OCRText sahəsində etiketi və ya ekrandakı mətni olduğu kimi çıxart.';

  const openAiResult = await runOpenAIVision(url, instructions);
  if (openAiResult) {
    return openAiResult;
  }

  const groqResult = await runGroqVision(url, instructions);
  if (groqResult) {
    return groqResult;
  }

  return null;
}

async function runOpenAIVision(
  url: string,
  instructions: string
): Promise<VisionInsight | null> {
  if (!hasOpenAI || !openaiClient) {
    return null;
  }

  try {
    const response = await openaiClient.responses.create({
      model: env.OPENAI_VISION_MODEL,
      temperature: 0.2,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: instructions
            }
          ] as any
        },
        {
          role: 'user',
          content: [
            { type: 'input_text', text: 'Bu şəkildən mümkün qədər çox məlumat çıxart' },
            { type: 'input_image', image_url: url, detail: 'high' }
          ] as any
        }
      ] as any
    });

    const insight = parseVisionResponse(response.output_text ?? '');
    if (insight) {
      return insight;
    }

    const fallbackSummary = response.output_text?.trim();
    if (fallbackSummary) {
      return {
        summary: fallbackSummary,
        probableModel: extractModel(fallbackSummary),
        damageNotes: extractDamage(fallbackSummary)
      };
    }
  } catch (error) {
    logger.warn({ err: error }, 'OpenAI vision analysis failed');
    return {
      summary: `Şəkil analizi zamanı xəta baş verdi (${(error as Error).message}). İnsan operatoru tərəfindən yoxlayın.`
    };
  }

  return null;
}

async function runGroqVision(
  url: string,
  instructions: string
): Promise<VisionInsight | null> {
  if (!hasGroq || !groqClient) {
    return null;
  }

  try {
    const completion = await groqClient.chat.completions.create({
      model: env.GROQ_VISION_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: instructions },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Bu şəkildən mümkün qədər çox məlumat çıxart' },
            { type: 'image_url', image_url: { url } }
          ] as any
        }
      ]
    });

    const content = completion.choices[0]?.message?.content ?? '';
    const insight = parseVisionResponse(content);
    if (insight) {
      return insight;
    }

    const summary = content.trim();
    if (summary) {
      return {
        summary,
        probableModel: extractModel(summary),
        damageNotes: extractDamage(summary)
      };
    }
  } catch (error) {
    logger.warn({ err: error }, 'Groq vision fallback failed');
  }

  return null;
}

function parseVisionResponse(raw: string): VisionInsight | null {
  const cleaned = raw
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/i, '')
    .replace(/```$/, '');

  if (!cleaned) {
    return null;
  }

  try {
    const parsed = JSON.parse(cleaned) as VisionInsight;
    if (parsed && typeof parsed.summary === 'string' && parsed.summary.trim().length) {
      return {
        summary: parsed.summary.trim(),
        probableModel: parsed.probableModel?.trim() || extractModel(parsed.summary),
        damageNotes: parsed.damageNotes?.trim() || extractDamage(parsed.summary),
        ocrText: parsed.ocrText?.trim()
      };
    }
  } catch (error) {
    logger.debug({ err: error, raw }, 'Failed to parse vision JSON');
  }

  return null;
}

function extractModel(text: string): string | undefined {
  const match = text.match(/model(?:i)?[:\-]?\s*([A-Za-z0-9\- ]{3,50})/i);
  return match?.[1]?.trim();
}

function extractDamage(text: string): string | undefined {
  const match = text.match(/(zədə|çat|sın|damage)[^.\n]*/i);
  return match?.[0]?.trim();
}
