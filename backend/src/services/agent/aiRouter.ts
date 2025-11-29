import { groqClient, hasGroq, openaiClient, hasOpenAI } from '../../config/ai';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export interface IntentClassification {
  needsStock: boolean;
  needsCompetitors: boolean;
  needsPricing: boolean;
  needsVision: boolean;
  handover: boolean;
}

const FALLBACK_INTENT: IntentClassification = {
  needsStock: false,
  needsCompetitors: false,
  needsPricing: false,
  needsVision: false,
  handover: false
};

export async function classifyIntent(message: string): Promise<IntentClassification> {
  const prompt = `
Sən PierringShot Electronics üçün operativ ümumi baxış agentisən.
Mətn verilir. JSON formatında cavab ver:
{
 "needsStock": boolean // daxili stokda məhsul axtarmaq lazımdırsa true
 "needsCompetitors": boolean // rəqib qiyməti (Tap.az) toplamaq lazımdırsa true
 "needsPricing": boolean // dinamik təklif hesablaması üçün true
 "needsVision": boolean // şəkil analizi tələb olunursa true
 "handover": boolean // insan operatoruna ötürmə tələb olunursa true
}
Mətn: """${message}"""`.trim();

  if (hasGroq && groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: env.GROQ_ROUTER_MODEL,
        messages: [
          { role: 'system', content: 'JSON formatında cavab ver. Başqa heç nə yazma.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0
      });

      const content = completion.choices[0]?.message?.content ?? '{}';
      return parseIntent(content);
    } catch (error) {
      logger.warn({ err: error }, 'Groq intent classification failed');
    }
  }

  if (hasOpenAI && openaiClient) {
    try {
      const completion = await openaiClient.responses.create({
        model: env.OPENAI_MODEL,
        input: [
          {
            role: 'system',
            content: 'Yalnız JSON obyektini qaytar.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0
      });
      const text = completion.output_text ?? '{}';
      return parseIntent(text);
    } catch (error) {
      logger.warn({ err: error }, 'OpenAI fallback intent classification failed');
    }
  }

  return FALLBACK_INTENT;
}

function parseIntent(raw: string): IntentClassification {
  const cleaned = raw
    .trim()
    .replace(/^```json/i, '')
    .replace(/```$/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '');

  try {
    const parsed = JSON.parse(cleaned) as Partial<IntentClassification>;
    return {
      needsStock: Boolean(parsed.needsStock),
      needsCompetitors: Boolean(parsed.needsCompetitors),
      needsPricing: Boolean(parsed.needsPricing),
      needsVision: Boolean(parsed.needsVision),
      handover: Boolean(parsed.handover)
    };
  } catch (error) {
    logger.warn({ err: error, raw }, 'Failed to parse intent classification JSON');
    return FALLBACK_INTENT;
  }
}
