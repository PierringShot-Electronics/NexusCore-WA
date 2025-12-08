import { contextManager } from './contextManager';
import { logger } from '../../utils/logger';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { detectCommand, type CommandType } from './commandHandler';
import { classifyIntent } from './aiRouter';
import { executeTools } from './toolExecutor';
import { buildAssistantReply } from './responseBuilder';
import { whatsappGatewayClient } from './whatsappGatewayClient';
import type { AgentReplyMessage } from './whatsappGatewayClient';
import { determinePersona } from './personaStrategy';
import type { PersonaDecision } from './personaStrategy';
import { evaluateGuardrails } from './guardrails';
import { processMediaMessages } from './mediaProcessor';
import { extractTextFromBufferedMessage } from './textUtils';
import { getAgentHeuristicMatchers } from '../../config/agentConfig';
import { buildClarification } from './intentClarifier';
import { telemetryEventBus, type TelemetryStage } from '../telemetry/eventBus';

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
    const stageTimers = new Map<TelemetryStage, number>();
    const startStage = (stage: TelemetryStage) => {
      stageTimers.set(stage, Date.now());
    };
    let currentPersonaKey: string | undefined;
    let currentModel: string | undefined;
    const finishStage = (stage: TelemetryStage, meta?: Record<string, unknown>) => {
      const started = stageTimers.get(stage);
      telemetryEventBus.emit({
        chatId: chatExternalId,
        stage,
        status: 'success',
        durationMs:
          typeof started === 'number' ? Math.max(Date.now() - started, 0) : undefined,
        persona: currentPersonaKey,
        model: currentModel,
        meta
      });
      stageTimers.delete(stage);
    };
    const failStage = (
      stage: TelemetryStage,
      error: unknown,
      meta?: Record<string, unknown>
    ) => {
      const started = stageTimers.get(stage);
      telemetryEventBus.emit({
        chatId: chatExternalId,
        stage,
        status: 'error',
        durationMs:
          typeof started === 'number' ? Math.max(Date.now() - started, 0) : undefined,
        persona: currentPersonaKey,
        model: currentModel,
        meta: {
          ...(meta ?? {}),
          error:
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'unknown_error'
        }
      });
      stageTimers.delete(stage);
    };
    const stageActive = (stage: TelemetryStage) => stageTimers.has(stage);

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

    startStage('buffer');

    const command = findLastCommand(bufferedMessages);
    if (command) {
      await contextManager.appendMessage({
        chatId,
        role: 'system',
        messageType: 'command',
        content: { command }
      });

      logger.info({ chatExternalId, command }, 'Detected user command');
      if (stageActive('buffer')) {
        finishStage('buffer', {
          messageCount: bufferedMessages.length,
          reason: 'command_detected'
        });
      }
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

    if (stageActive('buffer')) {
      finishStage('buffer', {
        messageCount: bufferedMessages.length,
        hasUserText: consolidated.hasUserText,
        mediaCounts: {
          audio: consolidated.audio.length,
          image: consolidated.images.length,
          video: consolidated.videos.length,
          document: consolidated.documents.length
        }
      });
    }

    const primaryText = consolidated.hasUserText
      ? consolidated.text?.trim().toLowerCase() ?? ''
      : '';
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
            body:
              'Məhsul və ya texniki dəstək haqqında sualınız varsa, buyurun yazın – sevinərək kömək edərəm.'
          }
        ];
        await whatsappGatewayClient.sendMessages({
          chatId: chatExternalId,
          messages: greetingReply
        });
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
        if (stageActive('buffer')) {
          finishStage('buffer', {
            messageCount: bufferedMessages.length,
            reason: 'greeting_detected'
          });
        }
        return;
      }
    }

  const latestMessage = extractTextFromBufferedMessage(
    bufferedMessages[bufferedMessages.length - 1]
  );

  const fallbackSummary =
    whatsappGatewayClient.buildBufferedSummary(bufferedMessages);

  const userMessage = (() => {
    if (consolidated.hasUserText && consolidated.text.trim().length > 0) {
      return consolidated.text.trim();
    }
    if (latestMessage && latestMessage.trim().length > 0) {
      return latestMessage.trim();
    }
    if (fallbackSummary && fallbackSummary.trim().length > 0) {
      return fallbackSummary.trim();
    }
    return 'İstifadəçi yeni mesaj göndərdi.';
  })();

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
        await whatsappGatewayClient.sendMessages({
          chatId: chatExternalId,
          messages: greetingReply
        });
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
        if (stageActive('buffer')) {
          finishStage('buffer', {
            messageCount: bufferedMessages.length,
            reason: 'greeting_detected'
          });
        }
        return;
      }
    }

    const recentMessages = await contextManager.getRecentMessages(chatId, 60);
    const assistantHistory = recentMessages.filter((message) => message.role === 'assistant');
    const previousAssistantBodies = assistantHistory.flatMap((message) =>
      extractAssistantBodies(message.content)
    );
    const previousAssistantSignatures = new Set(
      previousAssistantBodies.map((body) => normalizeMessageSignature(body))
    );

    const previousAssistantNormalized = previousAssistantBodies.map((body) =>
      normalizeMessageSignature(body)
    );

    const clarificationTriggers = [
      'daha dəqiq cavab verməyim üçün',
      'xahiş edirəm sualınızı',
      'xahiş edirəm sualınızı və ya istəyinizi',
      'mesajınız çatdı amma mətn',
      'problemi və ya istədiyiniz məhsulu qısa şəkildə yenidən yazın'
    ];
    const escalationTriggers = [
      'insan əməkdaşımız',
      'insan əməkdaşımıza',
      'cavabı operatorumuz hazırlayır',
      'komandamız hazır',
      'sorğunuzu qeydə aldım və komandamızla dəqiqləşdiririk'
    ];

    const clarificationMatches = previousAssistantNormalized.filter((body) =>
      clarificationTriggers.some((trigger) => body.includes(trigger))
    ).length;

    const escalationMatches = previousAssistantNormalized.filter((body) =>
      escalationTriggers.some((trigger) => body.includes(trigger))
    ).length;

    const clarificationHistoryCount =
      clarificationMatches +
      assistantHistory.filter((message) => message.messageType === 'clarification').length;

    const handoverHistoryCount = assistantHistory.filter(
      (message) => message.messageType === 'handover'
    ).length;

    const previousDetailRequests = clarificationHistoryCount;
    const previousEscalationCount = Math.max(escalationMatches, handoverHistoryCount);

    logger.info(
      {
        chatExternalId,
        bufferedCount: bufferedMessages.length,
        recentContext: recentMessages.length
      },
      'Prepared context for agent decision'
    );

    const opaqueSignature = normalizeMessageSignature('İstifadəçi yeni mesaj göndərdi.');
    const hasMediaPayload = bufferedMessages.some(
      (message) =>
        message.type === 'image' ||
        message.type === 'video' ||
        message.type === 'audio' ||
        message.type === 'document'
    );

    const isOpaqueMessage =
      !consolidated.hasUserText &&
      normalizeMessageSignature(userMessage) === opaqueSignature;

    if (isOpaqueMessage && !hasMediaPayload) {
      if (clarificationHistoryCount > 0) {
        if (previousEscalationCount > 0) {
          logger.info(
            { chatExternalId },
            'Opaque message detected but clarification and escalation already sent; skipping.'
          );
          if (stageActive('buffer')) {
            finishStage('buffer', {
              messageCount: bufferedMessages.length,
              reason: 'opaque_skipped'
            });
          }
          return;
        }

        const escalationMessages = buildEscalationMessages(
          buildPreview(userMessage),
          previousEscalationCount
        );

        const escalationAlreadySent = escalationMessages.every((message) =>
          message.type !== 'text'
            ? false
            : previousAssistantSignatures.has(normalizeMessageSignature(message.body))
        );
        if (escalationAlreadySent) {
          logger.info(
            { chatExternalId },
            'Escalation messages already delivered previously; no additional send.'
          );
          if (stageActive('buffer')) {
            finishStage('buffer', {
              messageCount: bufferedMessages.length,
              reason: 'opaque_escalation_already_sent'
            });
          }
          return;
        }

        await whatsappGatewayClient.sendMessages({
          chatId: chatExternalId,
          messages: escalationMessages
        });

        await contextManager.appendMessage({
          chatId,
          role: 'assistant',
          messageType: 'handover',
          content: {
            intent: {
              needsStock: false,
              needsCompetitors: false,
              needsPricing: false,
              needsVision: false,
              handover: true
            },
            response: escalationMessages
          }
        });

        if (stageActive('buffer')) {
          finishStage('buffer', {
            messageCount: bufferedMessages.length,
            reason: 'opaque_escalation_sent'
          });
        }
        return;
      }

      if (previousAssistantSignatures.has(opaqueSignature)) {
        logger.info(
          { chatExternalId },
          'Skipping duplicate opaque-message clarification to avoid loops'
        );
        if (stageActive('buffer')) {
          finishStage('buffer', {
            messageCount: bufferedMessages.length,
            reason: 'opaque_duplicate'
          });
        }
        return;
      }

      const clarificationMessage = [
        {
          type: 'text' as const,
          body:
            'Mesajınız çatdı, amma mətn və ya fayl görünmür. Zəhmət olmasa problemi və ya istədiyiniz məhsulu qısa şəkildə yenidən yazın və ya lazım olan foto/səsi təkrar göndərin, kömək edim.'
        }
      ];

      const clarificationAlreadySent = clarificationMessage.every((message) =>
        message.type !== 'text'
          ? false
          : previousAssistantSignatures.has(normalizeMessageSignature(message.body))
      );
      if (clarificationAlreadySent) {
        logger.info(
          { chatExternalId },
          'Clarification already delivered earlier; skipping duplicate send.'
        );
        if (stageActive('buffer')) {
          finishStage('buffer', {
            messageCount: bufferedMessages.length,
            reason: 'opaque_clarification_already_sent'
          });
        }
        return;
      }

      await whatsappGatewayClient.sendMessages({
        chatId: chatExternalId,
        messages: clarificationMessage
      });

      await contextManager.appendMessage({
        chatId,
        role: 'assistant',
        messageType: 'clarification',
        content: {
          intent: {
            needsStock: false,
            needsCompetitors: false,
            needsPricing: false,
            needsVision: false,
            handover: false
          },
          tools: {},
          messages: clarificationMessage
        }
      });

      if (stageActive('buffer')) {
        finishStage('buffer', {
          messageCount: bufferedMessages.length,
          reason: 'opaque_clarification_sent'
        });
      }
      return;
    }

    startStage('intent');
    let intent: Awaited<ReturnType<typeof classifyIntent>>;
    try {
      intent = await classifyIntent(userMessage);
      finishStage('intent', {
        handover: intent.handover,
        needsStock: intent.needsStock,
        needsPricing: intent.needsPricing,
        needsVision: intent.needsVision,
        needsCompetitors: intent.needsCompetitors
      });
    } catch (error) {
      failStage('intent', error);
      throw error;
    }

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

      await whatsappGatewayClient.sendMessages({
        chatId: chatExternalId,
        messages: handoverMessage
      });
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

    startStage('tools');
    let toolResults: Awaited<ReturnType<typeof executeTools>>;
    try {
      toolResults = await executeTools(intent, {
        userMessage,
        buffered: bufferedMessages
      });
      finishStage('tools', {
        visionCount: toolResults.vision?.length ?? 0,
        stockMatches: toolResults.stock?.matches?.length ?? 0,
        competitorOffers: toolResults.competitors?.offers?.length ?? 0,
        pricingCalculated: Boolean(toolResults.pricing)
      });
    } catch (error) {
      failStage('tools', error);
      throw error;
    }

    const hasAudio = bufferedMessages.some((msg) => msg.type === 'audio');
    const hasVisionCandidate =
      bufferedMessages.some((msg) => msg.type === 'image' || msg.type === 'video') ||
      Boolean(toolResults.vision && toolResults.vision.length > 0);

    startStage('persona');
    let personaDecision: PersonaDecision;
    try {
      personaDecision = determinePersona({
        intent,
        userMessage,
        tools: toolResults,
        hasAudio,
        hasVision: hasVisionCandidate,
        hasComplaintHistory: previousAssistantBodies.some((body) => /şikayət|naraz/i.test(body))
      });
      currentPersonaKey = personaDecision.profile.key;
      currentModel = personaDecision.profile.preferredModel;
      finishStage('persona', {
        persona: personaDecision.profile.key,
        rationale: personaDecision.rationale,
        profile: personaDecision.profile.title
      });
    } catch (error) {
      failStage('persona', error);
      throw error;
    }

    startStage('response');
    let assistantMessages: AgentReplyMessage[];
    try {
      assistantMessages = await buildAssistantReply({
        recentMessages,
        userMessage,
        tools: toolResults,
        persona: personaDecision
      });
    } catch (error) {
      failStage('response', error);
      throw error;
    }

    const filteredMessages = assistantMessages.filter((message) => {
      const guardrail = evaluateGuardrails(message.body);
      if (guardrail.blocked) {
        logger.warn({ chatExternalId }, 'Message blocked by guardrail');
        return false;
      }
      return true;
    });

    if (stageActive('response')) {
      finishStage('response', {
        generatedMessages: assistantMessages.length,
        filteredMessages: filteredMessages.length
      });
    }

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

    const previewSource =
      consolidated.hasUserText && consolidated.text.trim().length
        ? consolidated.text
        : fallbackSummary && fallbackSummary.trim().length
          ? fallbackSummary
          : userMessage;
    const preview = buildPreview(previewSource);

    if (looksGeneric) {
      if (previousDetailRequests > 1) {
        intent.handover = true;
        outgoing = buildEscalationMessages(preview, previousEscalationCount);
      } else {
        const clarification = buildClarification(userMessage);
        if (clarification) {
          const intro =
            preview.length > 3
              ? `Yazdığınız "${preview}" sorğusunu qeydə aldım.`
              : 'Sorğunuzu qeydə aldım.';

          outgoing = [
            {
              type: 'text' as const,
              body: intro
            },
            {
              type: 'text' as const,
              body: clarification.prompt
            },
            {
              type: 'text' as const,
              body: 'Zəhmət olmasa uyğun variantın nömrəsini və ya qısa açıqlamasını yazın ki, dəqiq cavab verə bilim.'
            }
          ];
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
    }

    outgoing = removePreviouslySentMessages(outgoing, previousAssistantSignatures);

    if (!outgoing.length) {
      intent.handover = true;
      outgoing = buildEscalationMessages(preview, previousEscalationCount + 1);
      outgoing = removePreviouslySentMessages(outgoing, previousAssistantSignatures);
    }

    outgoing = dedupeMessages(outgoing);

    if (!outgoing.length) {
      logger.info(
        { chatExternalId },
        'No new assistant messages after deduplication; skipping send'
      );
      return;
    }

    startStage('send');
    try {
      await whatsappGatewayClient.sendMessages({
        chatId: chatExternalId,
        messages: outgoing
      });
      finishStage('send', {
        messageCount: outgoing.length,
        handover: intent.handover
      });
    } catch (error) {
      logger.error({ err: error, chatExternalId }, 'Failed to deliver message via WhatsApp gateway');
      failStage('send', error, { messageCount: outgoing.length });
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

interface ConsolidatedMessages {
  text: string;
  audio: string[];
  images: string[];
  videos: string[];
  documents: string[];
  notes: string[];
  hasUserText: boolean;
}

async function consolidateBufferedMessages(
  messages: BufferedMessagePayload[]
): Promise<ConsolidatedMessages> {
  const textSegments: string[] = [];
  const audioUrls: string[] = [];
  const imageUrls: string[] = [];
  const videoUrls: string[] = [];
  const documentUrls: string[] = [];
  let audioCount = 0;
  let imageCount = 0;
  let videoCount = 0;
  let documentCount = 0;
  let hasUserText = false;

  for (const message of messages) {
    const extractedText = extractTextFromBufferedMessage(message);
    if (extractedText) {
      hasUserText = true;
      textSegments.push(extractedText);
    }

    if (message.type === 'audio' && message.audioUrl) {
      audioUrls.push(message.audioUrl);
    }
    if (message.type === 'audio') {
      audioCount += 1;
    }

    if (message.type === 'image' && message.imageUrl) {
      imageUrls.push(message.imageUrl);
    }
    if (message.type === 'image') {
      imageCount += 1;
    }

    if (message.type === 'video' && message.videoUrl) {
      videoUrls.push(message.videoUrl);
    }
    if (message.type === 'video') {
      videoCount += 1;
    }

    if (message.type === 'document' && message.documentUrl) {
      documentUrls.push(message.documentUrl);
    }
    if (message.type === 'document') {
      documentCount += 1;
    }
  }

  if (imageCount > 0) {
    const plural = imageCount > 1 ? 'lər' : '';
    textSegments.push(`[Şəkil${plural}] Müştəri ${imageCount} şəkil göndərdi.`);
  }

  if (videoCount > 0) {
    const plural = videoCount > 1 ? 'lər' : '';
    textSegments.push(`[Video${plural}] Müştəri ${videoCount} video faylı göndərdi.`);
  }

  if (documentCount > 0) {
    const plural = documentCount > 1 ? 'lər' : '';
    textSegments.push(`[Sənəd${plural}] Müştəri ${documentCount} sənəd paylaşdı.`);
  }

  if (audioCount > 0 && !textSegments.some((segment) => segment.includes('[Səs mesajı]'))) {
    const plural = audioCount > 1 ? 'lar' : '';
    textSegments.push(`[Səs mesajı${plural}] Müştəri ${audioCount} səs yazısı göndərdi.`);
  }

  const mediaSummary = await processMediaMessages(messages);

  for (const transcript of mediaSummary.audioTranscripts) {
    if (transcript.transcript) {
      hasUserText = true;
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
    notes,
    hasUserText
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
  return value
    .replace(/[*_~`]+/g, '')
    .replace(/[\s\u00a0]+/g, ' ')
    .trim()
    .toLowerCase();
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
