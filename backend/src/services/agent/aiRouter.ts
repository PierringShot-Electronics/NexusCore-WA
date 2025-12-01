import { openaiClient, hasOpenAI, groqClient, hasGroq } from '../../config/ai';
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

  const providers: Array<() => Promise<string | null>> = [];
  const openAiRouterModel = env.OPENAI_ROUTER_MODEL || env.OPENAI_MODEL;

  if (hasOpenAI && openaiClient) {
    const client = openaiClient;
    providers.push(async () => {
      try {
        const completion = await client.responses.create({
          model: openAiRouterModel,
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
        logger.debug('Intent classified via OpenAI model.');
        return text;
      } catch (error) {
        logger.warn({ err: error }, 'OpenAI intent classification failed, trying fallback provider.');
        return null;
      }
    });
  }

  if (hasGroq && groqClient) {
    const client = groqClient;
    providers.push(async () => {
      try {
        const completion = await client.chat.completions.create({
          model: env.GROQ_ROUTER_MODEL,
          messages: [
            { role: 'system', content: 'JSON formatında cavab ver. Başqa heç nə yazma.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0
        });

        const content = completion.choices[0]?.message?.content ?? '{}';
        logger.debug('Intent classified via Groq router model.');
        return content;
      } catch (error) {
        logger.warn({ err: error }, 'Groq intent classification failed.');
        return null;
      }
    });
  }

  for (const provider of providers) {
    const result = await provider();
    if (result) {
      return parseIntent(result);
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
