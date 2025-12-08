import { env } from '../../config/env';
import { openaiClient, hasOpenAI } from '../../config/ai';
import { loadBusinessPrompt } from './promptLoader';
import type { PersistedMessage } from './contextManager';
import type { ToolSummary } from './toolExecutor';
import { logger } from '../../utils/logger';
import type { AgentReplyMessage } from './wahaClient';
import type { PersonaDecision } from './personaStrategy';
import { recordModelUsage } from '../telemetry/costTracker';

interface ResponseBuilderOptions {
  chatId: string;
  recentMessages: PersistedMessage[];
  userMessage: string;
  tools: ToolSummary;
  persona: PersonaDecision;
}

export async function buildAssistantReply(
  options: ResponseBuilderOptions
): Promise<AgentReplyMessage[]> {
  if (!hasOpenAI || !openaiClient) {
    return [
      {
        type: 'text',
        body:
          'Hazırda süni intellekt modulu deaktivdir. Sorğunuzu insan operatora yönləndirirəm.'
      }
    ];
  }

  const { chatId, recentMessages, userMessage, tools, persona } = options;
  const systemPrompt = await loadBusinessPrompt();

  const contextBlock = renderContext(recentMessages);
  const toolBlock = renderTools(tools);
  const personaBlock = renderPersona(persona);

  const orchestrationBlock = renderOrchestrationBrief(tools);

  const prompt = `
${systemPrompt}

[Persona Yönləndirilməsi]
${personaBlock}

[Multi-Agent Orkestrasiya]
${orchestrationBlock}

[Kontekst]
${contextBlock}

[Alətlərdən çıxan məlumat]
${toolBlock}

[Tapşırıq]
- Cavabı WhatsApp üçün 2-3 qısa mesaj şəklində hazırla.
- Əsas məqamları **qalın** vurğula.
- Səs transkriptləri və vizual qeydləri cavabda inteqrasiya et (mövcuddursa).
- Əgər məlumat çatışmırsa, səmimi şəkildə xəbərdar et və alternativ təklif et.
- İnsan operatoruna yalnız həqiqətən zəruri hallarda (məsələn, gizli məlumat, fiziki müdaxilə və ya səlahiyyət hüdudundan kənar mövzular) yönləndir; əks halda cavabı özün tamamla.
- Rioz riskli hallarda (batareya şişməsi, qoxu və s.) cihazı dərhal servisə gətirməyi tövsiyə et.
- Nəticədə insan operatora ehtiyac varsa qeyd et.
`.trim();

  try {
    const candidates = buildModelCandidates(persona);
    if (!hasOpenAI || !openaiClient || !candidates.length) {
      throw new Error('OpenAI client unavailable for assistant reply');
    }

    for (const candidate of candidates) {
      try {
        const { text, model } = await generateWithModel({
          model: candidate.model,
          temperature: candidate.temperature,
          prompt,
          userMessage,
          chatId
        });

        const messages = transformTextToReplies(text);
        if (messages.length) {
          return messages;
        }
      } catch (candidateError) {
        logger.warn(
          {
            err: candidateError,
            model: candidate.model
          },
          'Assistant reply generation failed via OpenAI candidate'
        );
      }
    }

    throw new Error('No available OpenAI model produced a response');
  } catch (error) {
    logger.error({ err: error }, 'Failed to build assistant reply');
    return [
      {
        type: 'text',
        body:
          'Hazırda cavab hazırlamaq mümkün olmadı. Xahiş edirəm qısa müddət sonra yenidən yazın və ya insan operatoru tələb edin.'
      }
    ];
  }
}

interface ModelCandidate {
  model: string;
  temperature: number;
}

function renderContext(messages: PersistedMessage[]): string {
  if (!messages.length) {
    return 'Əvvəlki söhbət yoxdur.';
  }

  const sorted = [...messages].sort(
    (a, b) => normalizeTimestamp(a.createdAt) - normalizeTimestamp(b.createdAt)
  );

  return sorted
    .map((msg) => `${msg.role.toUpperCase()}: ${serializeContent(msg.content)}`)
    .join('\n');
}

function normalizeTimestamp(value: Date | string | number): number {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function renderTools(tools: ToolSummary): string {
  const parts: string[] = [];
  if (tools.vision?.length) {
    const entries = tools.vision
      .map((entry, idx) => {
        const prefix = `Şəkil ${idx + 1}`;
        const lines = [
          `${prefix}: ${entry.summary}`,
          entry.probableModel ? `• Model ehtimalı: ${entry.probableModel}` : null,
          entry.damageNotes ? `• Zədə qeydləri: ${entry.damageNotes}` : null,
          entry.ocrText ? `• Etiket/OCR: ${entry.ocrText}` : null
        ].filter(Boolean);
        return lines.join('\n');
      })
      .join('\n');
    parts.push(entries);
  }
  if (tools.stock && tools.stock.matches.length) {
    const lines = tools.stock.matches
      .map(
        (match) =>
          `- ${match.name} (SKU: ${match.sku ?? 'yoxdur'}) stok: ${
            match.stock ?? 'naməlum'
          }, maya: ${match.cost ?? 'naməlum'}`
      )
      .join('\n');
    parts.push(`Daxili stok (${tools.stock.strategy}):\n${lines}`);
  }
  if (tools.competitors && tools.competitors.offers.length) {
    const lines = tools.competitors.offers
      .map((offer) => `- ${offer.title}: ${offer.price} ${offer.currency}`)
      .join('\n');
    parts.push(`Tap.az rəqibləri:\n${lines}`);
  }
  if (tools.pricing?.offerPrice != null) {
    parts.push(
      `Tövsiyə edilən qiymət: ${tools.pricing.offerPrice} AZN (${tools.pricing.rationale})`
    );
  }
  return parts.length ? parts.join('\n') : 'Alət məlumatı yoxdur.';
}

function renderPersona(persona: PersonaDecision): string {
  const guidelines = persona.profile.guidelines
    .map((line, index) => `${index + 1}. ${line}`)
    .join('\n');

  return `${persona.profile.title} – ${persona.profile.summary}
Rasionale: ${persona.rationale}
Yanaşma:
${guidelines}`;
}

function renderOrchestrationBrief(tools: ToolSummary): string {
  const cues: string[] = [];
  cues.push(
    'Səs transkriptləri `[Səs mesajı]` prefiksi ilə verilə bilər; əsas sitatları kontekstə qat.'
  );
  if (tools.vision?.length) {
    cues.push('Vision nəticələrindəki ehtimal olunan model və zədə qeydlərini cavabda qeyd et.');
  } else {
    cues.push('Əgər vizual nəticə yoxdur, lakin foto göndərilibsə, operatora yönləndirməyi nəzərdən keçir.');
  }

  if (tools.stock?.matches?.length) {
    cues.push('Stok nəticələrində SKU və stok səviyyələrini cavabda paylaş.');
  }
  if (tools.competitors?.offers?.length) {
    cues.push('Rəqib qiymətlərindən qısa müqayisə qur.');
  }
  if (tools.pricing) {
    cues.push('Dinamik təklif hesablamasını AZN olaraq aydın yaz.');
  }

  cues.push('Cavabları 2-3 mesajdan çox etmə, hər mesaj 1-2 cümlə olsun.');

  return cues.map((cue, index) => `${index + 1}. ${cue}`).join('\n');
}

function buildModelCandidates(persona: PersonaDecision): ModelCandidate[] {
  const candidates: ModelCandidate[] = [];

  const preferredModel = persona.profile.preferredModel ?? env.OPENAI_MODEL;

  if (preferredModel) {
    candidates.push({
      model: preferredModel,
      temperature: persona.profile.temperature
    });
  }

  if (!candidates.length && env.OPENAI_MODEL) {
    candidates.push({
      model: env.OPENAI_MODEL,
      temperature: persona.profile.temperature
    });
  }

  return candidates;
}

async function generateWithModel(options: {
  model: string;
  temperature: number;
  prompt: string;
  userMessage: string;
  chatId: string;
}): Promise<{ text: string; model: string }> {
  if (!openaiClient) {
    throw new Error('OpenAI client is unavailable');
  }

  const completion = await openaiClient.responses.create({
    model: options.model,
    temperature: options.temperature,
    input: [
      { role: 'system', content: options.prompt },
      { role: 'user', content: options.userMessage }
    ]
  });
  const usage = completion.usage as
    | {
        input_tokens?: number;
        output_tokens?: number;
        prompt_tokens?: number;
        completion_tokens?: number;
      }
    | undefined;

  if (usage) {
    await recordModelUsage({
      chatId: options.chatId,
      provider: 'openai',
      model: completion.model ?? options.model,
      usage: {
        promptTokens: usage.input_tokens ?? usage.prompt_tokens,
        completionTokens: usage.output_tokens ?? usage.completion_tokens
      }
    });
  }

  return {
    text: completion.output_text ?? '',
    model: completion.model ?? options.model
  };
}

function transformTextToReplies(text: string): AgentReplyMessage[] {
  const parsed = attemptJsonMessageExtraction(text);
  if (parsed.length) {
    return parsed;
  }

  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map<AgentReplyMessage>((body) => ({ type: 'text', body }));
}

function serializeContent(content: Record<string, unknown>): string {
  try {
    if ('consolidated' in content) {
      const consolidated = content.consolidated as Record<string, unknown>;
      return String(consolidated.text ?? JSON.stringify(content));
    }
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

function attemptJsonMessageExtraction(text: string): AgentReplyMessage[] {
  const cleaned = text.trim();
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    return [];
  }

  try {
    const parsed = JSON.parse(cleaned) as {
      messages?: Array<{ body?: string; type?: string }>;
      message?: Array<{ body?: string; type?: string }>;
      content?: Array<{ body?: string; type?: string }>;
    };

    const arrays: Array<Array<{ body?: string; type?: string }>> = [];
    if (Array.isArray(parsed.messages)) {
      arrays.push(parsed.messages);
    }
    if (Array.isArray(parsed.message)) {
      arrays.push(parsed.message);
    }
    if (Array.isArray(parsed.content)) {
      arrays.push(parsed.content);
    }

    const flattened = arrays.flat();
    if (!flattened.length) {
      return [];
    }

    return flattened
      .map((item) => {
        const body = typeof item.body === 'string' ? item.body.trim() : '';
        if (!body) {
          return null;
        }
        const normalizedType =
          typeof item.type === 'string' ? item.type.trim().toLowerCase() : 'text';
        if (normalizedType !== 'text') {
          return null;
        }
        return { type: 'text' as const, body };
      })
      .filter((item): item is AgentReplyMessage => Boolean(item));
  } catch (error) {
    logger.debug({ err: error }, 'Failed to parse LLM JSON reply');
    return [];
  }
}
