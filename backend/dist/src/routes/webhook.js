"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookRouter = createWebhookRouter;
const express_1 = require("express");
const parser_1 = require("../services/buffer/parser");
function createWebhookRouter(buffer) {
    const router = (0, express_1.Router)();
    router.post('/', async (request, response) => {
        const parsed = (0, parser_1.parseWahaWebhookBody)(request.body);
        if (!parsed) {
            // Gracefully ignore unsupported payloads (ack required by WAHA).
            return response.status(202).json({ status: 'ignored' });
        }
        await buffer.enqueue(parsed.chatId, parsed.message);
        return response.status(200).json({ status: 'buffered' });
    });
    router.post('/flush', async (request, response) => {
        const chatId = request.body?.chatId;
        if (!chatId) {
            return response.status(400).json({ error: 'chatId is required' });
        }
        await buffer.flush(chatId);
        return response.status(200).json({ status: 'flushed' });
    });
    // Administrative endpoint to replay all buffers (useful during graceful shutdowns).
    router.post('/flush-all', async (_request, response) => {
        await buffer.flushAll();
        return response.status(200).json({ status: 'flushed-all' });
    });
    return router;
}
