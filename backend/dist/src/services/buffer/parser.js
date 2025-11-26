"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWahaWebhookBody = parseWahaWebhookBody;
const crypto_1 = require("crypto");
function parseWahaWebhookBody(body) {
    if (!body || typeof body !== 'object') {
        return null;
    }
    const payload = body;
    const [firstMessage] = payload.messages ?? [];
    if (!firstMessage) {
        return null;
    }
    const chatId = firstMessage.from;
    if (!chatId) {
        return null;
    }
    const type = mapMessageType(firstMessage.type);
    const timestampSeconds = firstMessage.timestamp
        ? Number(firstMessage.timestamp)
        : null;
    let receivedAtMs;
    if (timestampSeconds && !Number.isNaN(timestampSeconds)) {
        receivedAtMs = timestampSeconds * 1000;
    }
    else {
        receivedAtMs = Date.now();
    }
    const message = {
        id: firstMessage.id ?? (0, crypto_1.randomUUID)(),
        type,
        text: firstMessage.text?.body,
        audioUrl: firstMessage.audio?.url,
        imageUrl: firstMessage.image?.url,
        raw: firstMessage,
        receivedAt: new Date(receivedAtMs).toISOString()
    };
    return { chatId, message };
}
function mapMessageType(type) {
    if (!type) {
        return 'unknown';
    }
    switch (type) {
        case 'text':
            return 'text';
        case 'audio':
            return 'audio';
        case 'image':
            return 'image';
        default:
            return 'unknown';
    }
}
