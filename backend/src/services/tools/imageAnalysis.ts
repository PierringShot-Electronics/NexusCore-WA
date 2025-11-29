import { openaiClient, hasOpenAI } from '../../config/ai';
import { env } from '../../config/env';

export interface VisionInsight {
  summary: string;
  probableModel?: string;
  damageNotes?: string;
}

export async function analyzeImage(url: string): Promise<VisionInsight | null> {
  const instructions =
    'Sən PierringShot Electronics üçün texniki analiz mütəxəssisisən. ' +
    'Şəkildən cihazın dəqiq modelini və görünən zədələri tap, təmir üçün kritik qeydləri çıxart. ' +
    'Cavabı maksimum 4 maddəlik qısa bullet-lərlə təqdim et.';

  if (hasOpenAI && openaiClient) {
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

      const summary = response.output_text?.trim();
      if (summary) {
        return {
          summary,
          probableModel: extractModel(summary),
          damageNotes: extractDamage(summary)
        };
      }

      return {
        summary: 'Şəkil analizi heç bir məna kəsb etmədi. İnsan operatoru dəqiqləşdirməlidir.'
      };
    } catch (error) {
      return {
        summary: `Şəkil analizi zamanı xəta baş verdi (${(error as Error).message}). İnsan operatoru tərəfindən yoxlayın.`
      };
    }
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
