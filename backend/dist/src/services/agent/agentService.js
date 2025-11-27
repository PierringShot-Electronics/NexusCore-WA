"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = exports.AgentService = void 0;
const contextManager_1 = require("./contextManager");
const logger_1 = require("../../utils/logger");
const commandHandler_1 = require("./commandHandler");
const aiRouter_1 = require("./aiRouter");
const toolExecutor_1 = require("./toolExecutor");
const responseBuilder_1 = require("./responseBuilder");
const wahaClient_1 = require("./wahaClient");
const guardrails_1 = require("./guardrails");
const mediaProcessor_1 = require("./mediaProcessor");
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
        const consolidated = await consolidateBufferedMessages(bufferedMessages);
        await contextManager_1.contextManager.appendMessage({
            chatId,
            role: 'user',
            messageType: 'buffered',
            content: {
                consolidated,
                raw: bufferedMessages
            }
        });
        const recentMessages = await contextManager_1.contextManager.getRecentMessages(chatId);
        logger_1.logger.info({
            chatExternalId,
            bufferedCount: bufferedMessages.length,
            recentContext: recentMessages.length
        }, 'Prepared context for agent decision');
        const fallbackSummary = wahaClient_1.wahaClient.buildBufferedSummary(bufferedMessages);
        const userMessage = (consolidated.text || fallbackSummary || 'İstifadəçi yeni mesaj göndərdi.').trim();
        const intent = await (0, aiRouter_1.classifyIntent)(userMessage);
        if (intent.handover) {
            const handoverMessage = [
                {
                    type: 'text',
                    body: 'Sorğunuz daha detallıdır. İnsan əməkdaşımızla əlaqələndirirəm, zəhmət olmasa gözləyin.'
                }
            ];
            await wahaClient_1.wahaClient.sendMessages({ chatId: chatExternalId, messages: handoverMessage });
            await contextManager_1.contextManager.appendMessage({
                chatId,
                role: 'assistant',
                messageType: 'handover',
                content: { intent, response: handoverMessage }
            });
            return;
        }
        if (bufferedMessages.some((msg) => msg.type === 'image' || msg.type === 'video')) {
            intent.needsVision = true;
        }
        if (bufferedMessages.some((msg) => msg.type === 'audio')) {
            intent.needsStock = intent.needsStock || userMessage.length > 0;
        }
        const toolResults = await (0, toolExecutor_1.executeTools)(intent, {
            userMessage,
            buffered: bufferedMessages
        });
        const assistantMessages = await (0, responseBuilder_1.buildAssistantReply)({
            recentMessages,
            userMessage,
            tools: toolResults
        });
        const filteredMessages = assistantMessages.filter((message) => {
            const guardrail = (0, guardrails_1.evaluateGuardrails)(message.body);
            if (guardrail.blocked) {
                logger_1.logger.warn({ chatExternalId }, 'Message blocked by guardrail');
                return false;
            }
            return true;
        });
        const outgoing = filteredMessages.length
            ? filteredMessages
            : [
                {
                    type: 'text',
                    body: 'Sorğunuzu insan əməkdaşımıza yönləndirirəm. Zəhmət olmasa gözləyin.'
                }
            ];
        try {
            await wahaClient_1.wahaClient.sendMessages({
                chatId: chatExternalId,
                messages: outgoing
            });
        }
        catch (error) {
            logger_1.logger.error({ err: error, chatExternalId }, 'Failed to deliver message via WAHA');
        }
        await contextManager_1.contextManager.appendMessage({
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
exports.AgentService = AgentService;
exports.agentService = new AgentService();
async function consolidateBufferedMessages(messages) {
    const textSegments = [];
    const audioUrls = [];
    const imageUrls = [];
    const videoUrls = [];
    const documentUrls = [];
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
    const mediaSummary = await (0, mediaProcessor_1.processMediaMessages)(messages);
    for (const transcript of mediaSummary.audioTranscripts) {
        if (transcript.transcript) {
            textSegments.push(`[Səs mesajı] ${transcript.transcript.trim()}`);
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
