import { contextManager } from './contextManager';
import { logger } from '../../utils/logger';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { detectCommand, type CommandType } from './commandHandler';
import { classifyIntent } from './aiRouter';
import { executeTools } from './toolExecutor';
import { buildAssistantReply } from './responseBuilder';
import { wahaClient } from './wahaClient';
import type { AgentReplyMessage } from './wahaClient';
import { determinePersona } from './personaStrategy';
import type { PersonaDecision } from './personaStrategy';
import { evaluateGuardrails } from './guardrails';
import { processMediaMessages } from './mediaProcessor';
import { extractTextFromBufferedMessage } from './textUtils';
import { getAgentHeuristicMatchers } from '../../config/agentConfig';

interface HandleBufferedMessagesOptions {
  chatExternalId: string;
  customerName?: string;
  bufferedMessages: BufferedMessagePayload[];
}

export class AgentService {
  public async handleBufferedMessages(
    options: HandleBufferedMessagesOptions
  ): Promise<void> {
    const { chatExternalId, customerName, bufferedMessages } = options;
    const heuristics = getAgentHeuristicMatchers();

    const chatId = await contextManager.ensureChat(
      chatExternalId,
      customerName
    );

    if (chatExternalId.endsWith('@broadcast')) {
      logger.info(
        { chatExternalId },
        'Skipping broadcast/status event; no reply will be sent'
      );
      return;
    }

    const command = findLastCommand(bufferedMessages);
    if (command) {
      await contextManager.appendMessage({
        chatId,
        role: 'system',
        messageType: 'command',
        content: { command }
      });

      logger.info({ chatExternalId, command }, 'Detected user command');
      return;
    }

    const consolidated = await consolidateBufferedMessages(bufferedMessages);

    await contextManager.appendMessage({
      chatId,
      role: 'user',
      messageType: 'buffered',
      content: {
        consolidated,
        raw: bufferedMessages
      }
    });

    const primaryText = consolidated.text?.trim().toLowerCase() ?? '';
    if (primaryText) {
      const isGreeting = matchPatterns(heuristics.greeting, primaryText);

      if (isGreeting) {
        const greetingReply = [
          {
            type: 'text' as const,
            body: 'Salam! 👋 PierringShot Electronics-ə xoş gəlmisiniz.'
          },
          {
            type: 'text' as const,
            body: 'Məhsul və ya texniki dəstək haqqında sualınız varsa, buyurun yazın – sevinərək kömək edərəm.'
          }
        ];
        await wahaClient.sendMessages({ chatId: chatExternalId, messages: greetingReply });
        await contextManager.appendMessage({
          chatId,
          role: 'assistant',
          messageType: 'reply',
          content: {
            intent: {
              needsStock: false,
              needsCompetitors: false,
              needsPricing: false,
              needsVision: false,
              handover: false
            },
            tools: {},
            messages: greetingReply
          }
        });
        return;
      }
    }

    const latestMessage = extractTextFromBufferedMessage(
      bufferedMessages[bufferedMessages.length - 1]
    );

    const fallbackSummary = wahaClient.buildBufferedSummary(bufferedMessages);
    const userMessage = (
      consolidated.text ||
      latestMessage ||
      fallbackSummary ||
      'İstifadəçi yeni mesaj göndərdi.'
    ).trim();

    const normalizedForGreeting = (latestMessage || fallbackSummary || '').trim().toLowerCase();
    if (normalizedForGreeting) {
      const isGreeting = matchPatterns(heuristics.greeting, normalizedForGreeting);

      if (isGreeting) {
        const greetingReply = [
          {
            type: 'text' as const,
            body: 'Salam! 👋 PierringShot Electronics-ə xoş gəlmisiniz.'
          },
          {
            type: 'text' as const,
            body:
              'Məhsul və ya texniki dəstək haqqında sualınız varsa, buyurun yazın – sevinərək kömək edərəm.'
          }
        ];
        await wahaClient.sendMessages({ chatId: chatExternalId, messages: greetingReply });
        await contextManager.appendMessage({
          chatId,
          role: 'assistant',
          messageType: 'reply',
          content: {
            intent: {
              needsStock: false,
              needsCompetitors: false,
              needsPricing: false,
              needsVision: false,
              handover: false
            },
            tools: {},
            messages: greetingReply
          }
        });
        return;
      }
    }

    const recentMessages = await contextManager.getRecentMessages(chatId);
    const previousAssistantBodies = recentMessages
      .filter((message) => message.role === 'assistant')
      .flatMap((message) => extractAssistantBodies(message.content));
    const previousAssistantSignatures = new Set(
      previousAssistantBodies.map((body) => normalizeMessageSignature(body))
    );
    const previousDetailRequests = previousAssistantBodies.filter((body) =>
      body.includes('Daha dəqiq cavab verməyim üçün')
    ).length;
    const previousEscalationCount = previousAssistantBodies.filter((body) =>
      body.includes('insan əməkdaşımız')
    ).length;

    logger.info(
      {
        chatExternalId,
        bufferedCount: bufferedMessages.length,
        recentContext: recentMessages.length
      },
      'Prepared context for agent decision'
    );

    const intent = await classifyIntent(userMessage);

    const normalizedUserMessage = userMessage.toLowerCase();
    const explicitHandoverRequest = matchPatterns(
      heuristics.manualHandover,
      normalizedUserMessage
    );

    if (intent.handover && !explicitHandoverRequest) {
      intent.handover = false;
    }

    const productKeywordMatch = matchPatterns(heuristics.product, normalizedUserMessage);
    if (productKeywordMatch) {
      intent.needsStock = true;
    }

    const pricingKeywordMatch = matchPatterns(heuristics.pricing, normalizedUserMessage);
    if (pricingKeywordMatch) {
      intent.needsPricing = true;
    }

    const competitorKeywordMatch = matchPatterns(heuristics.competitor, normalizedUserMessage);
    if (competitorKeywordMatch) {
      intent.needsCompetitors = true;
    }

    const repairKeywordMatch = matchPatterns(heuristics.repair, normalizedUserMessage);
    if (repairKeywordMatch) {
      // ensure we prioritise diagnostics persona and avoid unnecessary handover
      intent.needsVision = intent.needsVision || false;
    }

    if (intent.handover) {
      const handoverMessage = [
        {
          type: 'text' as const,
          body:
            'Sorğunuz daha detallıdır. İnsan əməkdaşımızla əlaqələndirirəm, zəhmət olmasa gözləyin.'
        }
      ];

      await wahaClient.sendMessages({ chatId: chatExternalId, messages: handoverMessage });
      await contextManager.appendMessage({
        chatId,
        role: 'assistant',
        messageType: 'handover',
        content: { intent, response: handoverMessage }
      });
      return;
    }

    if (
      bufferedMessages.some(
        (msg) => msg.type === 'image' || msg.type === 'video'
      )
    ) {
      intent.needsVision = true;
    }

    if (bufferedMessages.some((msg) => msg.type === 'audio')) {
      // audio sorğuları adətən əlavə izah tələb edir, kontekstə transkript daxil ediləcək
      intent.needsStock = intent.needsStock || productKeywordMatch;
    }

    const toolResults = await executeTools(intent, {
      userMessage,
      buffered: bufferedMessages
    });

    const hasAudio = bufferedMessages.some((msg) => msg.type === 'audio');
    const hasVisionCandidate =
      bufferedMessages.some((msg) => msg.type === 'image' || msg.type === 'video') ||
      Boolean(toolResults.vision && toolResults.vision.length > 0);

    const personaDecision: PersonaDecision = determinePersona({
      intent,
      userMessage,
      tools: toolResults,
      hasAudio,
      hasVision: hasVisionCandidate,
      hasComplaintHistory: previousAssistantBodies.some((body) => /şikayət|naraz/i.test(body))
    });

    const assistantMessages = await buildAssistantReply({
      recentMessages,
      userMessage,
      tools: toolResults,
      persona: personaDecision
    });

    const filteredMessages = assistantMessages.filter((message) => {
      const guardrail = evaluateGuardrails(message.body);
      if (guardrail.blocked) {
        logger.warn({ chatExternalId }, 'Message blocked by guardrail');
        return false;
      }
      return true;
    });

    let outgoing = filteredMessages.length
      ? filteredMessages
      : [
          {
            type: 'text' as const,
            body: 'Sorğunuzu insan əməkdaşımıza yönləndirirəm. Zəhmət olmasa gözləyin.'
          }
        ];

    const fallbackTemplates = [
      'Sorğunuzu insan əməkdaşımıza yönləndirirəm. Zəhmət olmasa gözləyin.',
      'Daha dəqiq cavab verməyim üçün zəhmət olmasa istədiyiniz məhsul/model və ya problemin detalları barədə 1-2 cümləlik məlumat yazın.',
      'Sizi eşidirəm! Məhsul, qiymət və ya texniki dəstək ilə bağlı sualınızı biraz açsanız, dəqiq cavab verə bilərəm.'
    ];

    const fallbackSignatures = new Set(
      fallbackTemplates.map((template) => normalizeMessageSignature(template))
    );

    const looksGeneric =
      outgoing.length &&
      outgoing.every(
        (message) =>
          message.type === 'text' &&
          fallbackSignatures.has(normalizeMessageSignature(message.body))
      );

    if (looksGeneric) {
      const preview = buildPreview(userMessage);
      if (previousDetailRequests > 1) {
        intent.handover = true;
        outgoing = buildEscalationMessages(preview, previousEscalationCount);
      } else {
        outgoing =
          preview.length > 3
            ? [
                {
                  type: 'text' as const,
                  body: `Yazdığınız "${preview}" sorğusunu aldım.`
                },
                {
                  type: 'text' as const,
                  body:
                    'Daha dəqiq cavab verməyim üçün zəhmət olmasa istədiyiniz məhsul/model və ya problemin detalları barədə 1-2 cümləlik məlumat yazın.'
                }
              ]
            : [
                {
                  type: 'text' as const,
                  body:
                    'Sizi eşidirəm! Məhsul, qiymət və ya texniki dəstək ilə bağlı sualınızı biraz açsanız, dəqiq cavab verə bilərəm.'
                }
              ];
      }
    }

    const preview = buildPreview(userMessage);
    outgoing = removePreviouslySentMessages(outgoing, previousAssistantSignatures);

    if (!outgoing.length) {
      intent.handover = true;
      outgoing = buildEscalationMessages(preview, previousEscalationCount + 1);
    }

    outgoing = dedupeMessages(outgoing);

    try {
      await wahaClient.sendMessages({
        chatId: chatExternalId,
        messages: outgoing
      });
    } catch (error) {
      logger.error({ err: error, chatExternalId }, 'Failed to deliver message via WAHA');
    }

    await contextManager.appendMessage({
      chatId,
      role: 'assistant',
      messageType: 'reply',
      content: {
        intent,
        tools: toolResults,
        messages: outgoing,
        persona: personaDecision.profile.key,
        personaRationale: personaDecision.rationale
      }
    });
  }
}

function matchPatterns(patterns: RegExp[], input: string): boolean {
  return patterns.some((pattern) => pattern.test(input));
}

export const agentService = new AgentService();

async function consolidateBufferedMessages(
  messages: BufferedMessagePayload[]
): Promise<{
  text: string;
  audio: string[];
  images: string[];
  videos: string[];
  documents: string[];
  notes: string[];
}> {
  const textSegments: string[] = [];
  const audioUrls: string[] = [];
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];
  const documentUrls: string[] = [];

  for (const message of messages) {
    const extractedText = extractTextFromBufferedMessage(message);
    if (extractedText) {
      textSegments.push(extractedText);
    }

    if (message.type === 'audio' && message.audioUrl) {
      audioUrls.push(message.audioUrl);
    }

    if (message.type === 'image' && message.imageUrl) {
      imageUrls.push(message.imageUrl);
    }

    if (message.type === 'video' && message.videoUrl) {
      videoUrls.push(message.videoUrl);
    }

    if (message.type === 'document' && message.documentUrl) {
      documentUrls.push(message.documentUrl);
    }
  }

  const mediaSummary = await processMediaMessages(messages);

  for (const transcript of mediaSummary.audioTranscripts) {
    if (transcript.transcript) {
      textSegments.push(
        `[Səs mesajı] ${transcript.transcript.trim()}`
      );
    }
  }

  const notes = [
    ...mediaSummary.videoNotes.map((entry) => entry.note),
    ...mediaSummary.documentNotes.map((entry) => entry.note)
  ].filter(Boolean);

  textSegments.push(...notes);

  return {
    text: textSegments.join(' ').trim(),
    audio: audioUrls,
    images: imageUrls,
    videos: videoUrls,
    documents: documentUrls,
    notes
  };
}

function findLastCommand(messages: BufferedMessagePayload[]): CommandType {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (!message) {
      continue;
    }
    const candidateText = extractTextFromBufferedMessage(message);
    if (candidateText) {
      const command = detectCommand(candidateText);
      if (command) {
        return command;
      }
    }
  }

  return null;
}

function extractAssistantBodies(content: Record<string, unknown> | null | undefined): string[] {
  if (!content) {
    return [];
  }

  const record = content as Record<string, unknown>;
  const results: string[] = [];
  const maybeMessages = record['messages'];
  if (Array.isArray(maybeMessages)) {
    for (const entry of maybeMessages) {
      if (entry && typeof entry === 'object' && typeof (entry as { body?: unknown }).body === 'string') {
        results.push(((entry as { body?: unknown }).body as string).trim());
      }
    }
  }

  const maybeResponse = record['response'];
  if (Array.isArray(maybeResponse)) {
    for (const entry of maybeResponse) {
      if (entry && typeof entry === 'object' && typeof (entry as { body?: unknown }).body === 'string') {
        results.push(((entry as { body?: unknown }).body as string).trim());
      }
    }
  }

  const directBody = record['body'];
  if (typeof directBody === 'string') {
    results.push(directBody.trim());
  }

  return results;
}

function normalizeMessageSignature(value: string): string {
  return value.replace(/[\s\u00a0]+/g, ' ').trim().toLowerCase();
}

function buildPreview(message: string): string {
  const trimmed = message.trim();
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
}

function removePreviouslySentMessages(
  messages: AgentReplyMessage[],
  previous: Set<string>
): AgentReplyMessage[] {
  return messages.filter((message) => {
    if (message.type !== 'text') {
      return true;
    }
    return !previous.has(normalizeMessageSignature(message.body));
  });
}

function buildEscalationMessages(preview: string, attempt: number): AgentReplyMessage[] {
  const templates: Array<{
    headline: string;
    followUp: string;
  }> = [
    {
      headline:
        preview.length > 3
          ? `"${preview}" sorğunuzu qeydə aldım və komandamızla dəqiqləşdiririk.`
          : 'Sorğunuzu qeydə aldım və komandamızla dəqiqləşdiririk.',
      followUp: 'İnsan əməkdaşımız tezliklə cavab verəcək, zəhmət olmasa bildirişləri izləyin.'
    },
    {
      headline:
        preview.length > 3
          ? `"${preview}" mövzusu üzrə cavabı operatorumuz hazırlayır.`
          : 'Sorğunuz üzrə cavabı operatorumuz hazırlayır.',
      followUp: 'Komandamız hazır olan kimi sizə yenilənmə göndərəcək.'
    },
    {
      headline:
        preview.length > 3
          ? `"${preview}" sorğusu insan əməkdaşımıza yönləndirildi.`
          : 'Sorğunuz insan əməkdaşımıza yönləndirildi.',
      followUp: 'Ən qısa zamanda əlaqə saxlayacağıq və status barədə məlumat verəcəyik.'
    }
  ];

  const index = Math.min(Math.max(attempt, 0), templates.length - 1);
  const template = templates[index] ?? templates[0];
  if (!template) {
    const fallbackHeadline =
      preview.length > 3
        ? `"${preview}" sorğunuzu qeydə aldım və komandamızla dəqiqləşdiririk.`
        : 'Sorğunuzu qeydə aldım və komandamızla dəqiqləşdiririk.';
    return [
      {
        type: 'text' as const,
        body: fallbackHeadline
      },
      {
        type: 'text' as const,
        body: 'İnsan əməkdaşımız tezliklə cavab verəcək, zəhmət olmasa bildirişləri izləyin.'
      }
    ];
  }
  return [
    {
      type: 'text' as const,
      body: template.headline
    },
    {
      type: 'text' as const,
      body: template.followUp
    }
  ];
}

function dedupeMessages(messages: AgentReplyMessage[]): AgentReplyMessage[] {
  const seen = new Set<string>();
  const result: AgentReplyMessage[] = [];
  for (const message of messages) {
    if (message.type !== 'text') {
      result.push(message);
      continue;
    }
    const signature = normalizeMessageSignature(message.body);
    if (seen.has(signature)) {
      continue;
    }
    seen.add(signature);
    result.push(message);
  }
  return result;
}
