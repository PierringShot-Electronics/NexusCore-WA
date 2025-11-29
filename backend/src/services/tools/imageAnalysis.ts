import { openaiClient, hasOpenAI } from '../../config/ai';
import { env } from '../../config/env';

export interface VisionInsight {
  summary: string;
  probableModel?: string;
  damageNotes?: string;
}

export async function analyzeImage(url: string): Promise<VisionInsight | null> {
  if (!hasOpenAI || !openaiClient) {
    return null;
  }

  try {
    const response = await openaiClient.responses.create({
      model: env.OPENAI_MODEL,
      temperature: 0.2,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text:
                'Sən PierringShot Electronics üçün texniki analiz mütəxəssisisən. ' +
                'Şəkildən cihazın modelini, görünən zədələri və təmir üçün qeyd ediləcək əsas qeydləri çıxart. ' +
                'Cavabı qısa maddələr şəklində saxla.'
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

    const summary = response.output_text?.trim();
    if (!summary) {
      return null;
    }

    return {
      summary,
      probableModel: extractModel(summary),
      damageNotes: extractDamage(summary)
    };
  } catch (error) {
    return {
      summary:
        `Şəkil analizi zamanı xəta baş verdi (${(error as Error).message}). İnsan operatoru tərəfindən yoxlayın.`
    };
  }
}

function extractModel(text: string): string | undefined {
  const match = text.match(/model(?:i)?[:\-]?\s*([A-Za-z0-9\- ]{3,50})/i);
  return match?.[1]?.trim();
}

function extractDamage(text: string): string | undefined {
  const match = text.match(/(zədə|çat|sın|damage)[^.\n]*/i);
  return match?.[0]?.trim();
}
