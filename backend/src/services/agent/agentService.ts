import { contextManager } from './contextManager';
import { logger } from '../../utils/logger';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { detectCommand, type CommandType } from './commandHandler';
import { classifyIntent } from './aiRouter';
import { executeTools } from './toolExecutor';
import { buildAssistantReply } from './responseBuilder';
import { wahaClient } from './wahaClient';
import { evaluateGuardrails } from './guardrails';
import { processMediaMessages } from './mediaProcessor';

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
      const greetingPatterns = [/^s[aə]lam!?$/i, /^h(e|ə)y!?$/i, /^nec[əe]s[əe]n\??$/i];
      const isGreeting = greetingPatterns.some((regex) => regex.test(primaryText));

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

    const recentMessages = await contextManager.getRecentMessages(chatId);

    logger.info(
      {
        chatExternalId,
        bufferedCount: bufferedMessages.length,
        recentContext: recentMessages.length
      },
      'Prepared context for agent decision'
    );

    const fallbackSummary = wahaClient.buildBufferedSummary(bufferedMessages);
    const userMessage = (consolidated.text || fallbackSummary || 'İstifadəçi yeni mesaj göndərdi.').trim();
    const intent = await classifyIntent(userMessage);

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
      intent.needsStock = intent.needsStock || userMessage.length > 0;
    }

    const toolResults = await executeTools(intent, {
      userMessage,
      buffered: bufferedMessages
    });

    const assistantMessages = await buildAssistantReply({
      recentMessages,
      userMessage,
      tools: toolResults
    });

    const filteredMessages = assistantMessages.filter((message) => {
      const guardrail = evaluateGuardrails(message.body);
      if (guardrail.blocked) {
        logger.warn({ chatExternalId }, 'Message blocked by guardrail');
        return false;
      }
      return true;
    });

    const outgoing = filteredMessages.length
      ? filteredMessages
      : [
          {
            type: 'text' as const,
            body: 'Sorğunuzu insan əməkdaşımıza yönləndirirəm. Zəhmət olmasa gözləyin.'
          }
        ];

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
        messages: outgoing
      }
    });
  }
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
    if (message.type === 'text' && message.text) {
      textSegments.push(message.text.trim());
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
    if (message.type === 'text' && message.text) {
      const command = detectCommand(message.text);
      if (command) {
        return command;
      }
    }
  }

  return null;
}
