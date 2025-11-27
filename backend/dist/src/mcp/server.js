"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const z = __importStar(require("zod/v4"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const wahaClient_1 = require("../services/agent/wahaClient");
const ai_1 = require("../config/ai");
const promptLoader_1 = require("../services/agent/promptLoader");
const server = new mcp_js_1.McpServer({
    name: 'nexuscore-waha-mcp',
    version: '0.1.0'
});
const sessionSchema = z
    .object({
    name: z.string().optional(),
    status: z.string(),
    engine: z
        .object({
        engine: z.string(),
        state: z.string()
    })
        .optional(),
    me: z
        .object({
        id: z.string(),
        pushName: z.string().optional()
    })
        .optional()
})
    .passthrough();
server.registerTool('waha.sessionStatus', {
    title: 'WAHA Session Status',
    description: 'Returns the current WAHA session status.',
    inputSchema: z.object({}).optional(),
    outputSchema: sessionSchema
}, async () => {
    const session = await wahaClient_1.wahaClient.getSessionStatus();
    if (!session) {
        const fallback = { status: 'UNAVAILABLE' };
        return {
            content: [{ type: 'text', text: JSON.stringify(fallback, null, 2) }],
            structuredContent: fallback
        };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(session, null, 2) }],
        structuredContent: session
    };
});
server.registerTool('waha.fetchQr', {
    title: 'Fetch WAHA session QR',
    description: 'Fetches the QR code for the configured WAHA session. Returns an error payload while the session is already authenticated.',
    inputSchema: z.object({}).optional(),
    outputSchema: z.object({
        status: z.string(),
        qr: z.string().optional(),
        error: z.string().optional()
    })
}, async () => {
    const qr = await wahaClient_1.wahaClient.getSessionQr();
    if (!qr) {
        const payload = { status: 'PENDING', error: 'qr_not_available' };
        return {
            content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
            structuredContent: payload
        };
    }
    if ('error' in qr) {
        const payload = {
            status: qr.status ?? 'UNKNOWN',
            error: qr.error
        };
        return {
            content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
            structuredContent: payload
        };
    }
    const payload = { status: 'SCAN_QR_CODE', qr: qr.qr };
    return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload
    };
});
server.registerTool('waha.sendText', {
    title: 'Send WhatsApp text message',
    description: 'Sends a plain text message through WAHA using the configured session.',
    inputSchema: z.object({
        chatId: z.string().min(5, 'chatId must be provided e.g. 123456789@c.us'),
        text: z.string().min(1, 'Message text cannot be empty')
    }),
    outputSchema: z.object({
        status: z.literal('sent')
    })
}, async ({ chatId, text }) => {
    await wahaClient_1.wahaClient.sendMessages({
        chatId,
        messages: [{ type: 'text', body: text }]
    });
    const payload = { status: 'sent' };
    return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
    };
});
const replyInputSchema = z.object({
    chatId: z.string().min(5).optional(),
    userMessage: z.string().min(1, 'userMessage is required'),
    context: z.array(z.string().min(1)).default([]),
    send: z.boolean().default(false)
});
const replyOutputSchema = z.object({
    status: z.enum(['drafted', 'sent']),
    responses: z.array(z.string().min(1)),
    chatId: z.string().optional()
});
server.registerTool('agent.generateReply', {
    title: 'Generate reply with OpenAI',
    description: 'Generates WhatsApp-ready responses using OpenAI and optionally delivers them via WAHA.',
    inputSchema: replyInputSchema,
    outputSchema: replyOutputSchema
}, async ({ chatId, userMessage, context, send }) => {
    const replies = await generateReplies(userMessage, context);
    if (send) {
        if (!chatId) {
            throw new Error('chatId is required when send=true');
        }
        await wahaClient_1.wahaClient.sendMessages({
            chatId,
            messages: replies.map((body) => ({ type: 'text', body }))
        });
        const payload = { status: 'sent', responses: replies, chatId };
        return {
            content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
            structuredContent: payload
        };
    }
    const payload = { status: 'drafted', responses: replies, chatId };
    return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload
    };
});
async function generateReplies(userMessage, context) {
    if (!ai_1.hasOpenAI || !ai_1.openaiClient) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }
    const systemPrompt = await (0, promptLoader_1.loadBusinessPrompt)();
    const contextBlock = context.length
        ? context.join('\n')
        : 'Əlavə kontekst verilməyib.';
    try {
        const completion = await ai_1.openaiClient.responses.create({
            model: env_1.env.OPENAI_MODEL,
            temperature: 0.4,
            input: [
                {
                    role: 'system',
                    content: `${systemPrompt}

[Əlavə Kontekst]
${contextBlock}

[Tələb]
- Cavabı WhatsApp üçün 1-3 cümləlik mesajlara böl.
- Azərbaycan dilində cavab ver.
- Əsas məqamları **qalın** yazı ilə vurğula.
- Əgər məlumat kifayət etmirsə, nəzakətli şəkildə soruş.`
                },
                { role: 'user', content: userMessage }
            ]
        });
        const raw = completion.output_text ?? '';
        const replies = raw
            .split(/\n{2,}/)
            .map((chunk) => chunk.trim())
            .filter(Boolean);
        return replies.length ? replies : [raw || 'Məlumat hazırdır.'];
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to generate OpenAI response via MCP');
        throw new Error('OpenAI cavabı generasiya etmək mümkün olmadı.');
    }
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/mcp', async (req, res) => {
    const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });
    res.on('close', () => {
        transport.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});
const port = Number.parseInt(process.env.MCP_PORT ?? env_1.env.MCP_PORT ?? '3030', 10);
app
    .listen(port, () => {
    logger_1.logger.info({ port }, 'WAHA MCP server listening');
})
    .on('error', (error) => {
    logger_1.logger.error({ err: error }, 'Failed to start MCP server');
    process.exit(1);
});
