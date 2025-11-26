"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = exports.AgentService = void 0;
const contextManager_1 = require("./contextManager");
const logger_1 = require("../../utils/logger");
const commandHandler_1 = require("./commandHandler");
class AgentService {
    async handleBufferedMessages(options) {
        const { chatExternalId, customerName, bufferedMessages } = options;
        const chatId = await contextManager_1.contextManager.ensureChat(chatExternalId, customerName);
        const command = findLastCommand(bufferedMessages);
        if (command) {
            await contextManager_1.contextManager.appendMessage({
                chatId,
                role: 'system',
                messageType: 'command',
                content: { command }
            });
            logger_1.logger.info({ chatExternalId, command }, 'Detected user command');
            return;
        }
        await contextManager_1.contextManager.appendMessage({
            chatId,
            role: 'user',
            messageType: 'buffered',
            content: {
                consolidated: consolidateBufferedMessages(bufferedMessages),
                raw: bufferedMessages
            }
        });
        const recentMessages = await contextManager_1.contextManager.getRecentMessages(chatId);
        logger_1.logger.info({
            chatExternalId,
            bufferedCount: bufferedMessages.length,
            recentContext: recentMessages.length
        }, 'Prepared context for agent decision');
        // TODO: Route the consolidated message to the primary agent brain via OpenAI function calling.
        // This is intentionally left as a follow-up task after infrastructure scaffolding.
    }
}
exports.AgentService = AgentService;
exports.agentService = new AgentService();
function consolidateBufferedMessages(messages) {
    const textSegments = [];
    const audioUrls = [];
    const imageUrls = [];
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
function findLastCommand(messages) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
        const message = messages[i];
        if (!message) {
            continue;
        }
        if (message.type === 'text' && message.text) {
            const command = (0, commandHandler_1.detectCommand)(message.text);
            if (command) {
                return command;
            }
        }
    }
    return null;
}
