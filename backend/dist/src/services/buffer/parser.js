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
        audioUrl: firstMessage.audio?.url ?? firstMessage.voice?.url,
        imageUrl: firstMessage.image?.url,
        videoUrl: firstMessage.video?.url,
        documentUrl: firstMessage.document?.url,
        mimeType: firstMessage.audio?.mime_type ??
            firstMessage.voice?.mime_type ??
            firstMessage.image?.mime_type ??
            firstMessage.video?.mime_type ??
            firstMessage.document?.mime_type,
        caption: typeof firstMessage.caption === 'string' ? firstMessage.caption : undefined,
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
        case 'ptt':
        case 'voice':
            return 'audio';
        case 'image':
            return 'image';
        case 'video':
            return 'video';
        case 'document':
            return 'document';
        default:
            return 'unknown';
    }
}
