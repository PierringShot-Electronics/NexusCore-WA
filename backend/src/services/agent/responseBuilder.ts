import { env } from '../../config/env';
import { openaiClient, hasOpenAI } from '../../config/ai';
import { loadBusinessPrompt } from './promptLoader';
import type { PersistedMessage } from './contextManager';
import type { ToolSummary } from './toolExecutor';
import { logger } from '../../utils/logger';
import type { AgentReplyMessage } from './wahaClient';

interface ResponseBuilderOptions {
  recentMessages: PersistedMessage[];
  userMessage: string;
  tools: ToolSummary;
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

  const { recentMessages, userMessage, tools } = options;
  const systemPrompt = await loadBusinessPrompt();

  const contextBlock = renderContext(recentMessages);
  const toolBlock = renderTools(tools);

  const prompt = `
${systemPrompt}

[Kontekst]
${contextBlock}

[Alətlərdən çıxan məlumat]
${toolBlock}

[Tapşırıq]
- Cavabı WhatsApp üçün 2-3 qısa mesaj şəklində hazırla.
- Əsas məqamları **qalın** vurğula.
- Əgər məlumat çatışmırsa, səmimi şəkildə xəbərdar et və alternativ təklif et.
- Nəticədə insan operatora ehtiyac varsa qeyd et.
`.trim();

  try {
    const completion = await openaiClient.responses.create({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      input: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMessage }
      ]
    });

    const text = completion.output_text ?? '';
    const messages = text
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map<AgentReplyMessage>((body) => ({ type: 'text', body }));

    return messages.length > 0
      ? messages
      : [{ type: 'text', body: text || 'Məlumat hazırdır.' }];
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
  if (tools.vision) {
    parts.push(`Şəkil analizi: ${tools.vision.summary}`);
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
