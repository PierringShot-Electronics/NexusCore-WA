import { contextManager } from './contextManager';
import { logger } from '../../utils/logger';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { detectCommand, type CommandType } from './commandHandler';

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

    await contextManager.appendMessage({
      chatId,
      role: 'user',
      messageType: 'buffered',
      content: {
        consolidated: consolidateBufferedMessages(bufferedMessages),
        raw: bufferedMessages
      }
    });

    const recentMessages = await contextManager.getRecentMessages(chatId);

    logger.info(
      {
        chatExternalId,
        bufferedCount: bufferedMessages.length,
        recentContext: recentMessages.length
      },
      'Prepared context for agent decision'
    );

    // TODO: Route the consolidated message to the primary agent brain via OpenAI function calling.
    // This is intentionally left as a follow-up task after infrastructure scaffolding.
  }
}

export const agentService = new AgentService();

function consolidateBufferedMessages(
  messages: BufferedMessagePayload[]
): {
  text: string;
  audio: string[];
  images: string[];
} {
  const textSegments: string[] = [];
  const audioUrls: string[] = [];
  const imageUrls: string[] = [];

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
  }

  return {
    text: textSegments.join(' ').trim(),
    audio: audioUrls,
    images: imageUrls
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
