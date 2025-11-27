import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as z from 'zod/v4';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { wahaClient } from '../services/agent/wahaClient';
import { hasOpenAI, openaiClient } from '../config/ai';
import { loadBusinessPrompt } from '../services/agent/promptLoader';

const server = new McpServer({
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

server.registerTool(
  'waha.sessionStatus',
  {
    title: 'WAHA Session Status',
    description: 'Returns the current WAHA session status.',
    inputSchema: z.object({}).optional(),
    outputSchema: sessionSchema
  },
  async () => {
    const session = await wahaClient.getSessionStatus();
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
  }
);

server.registerTool(
  'waha.fetchQr',
  {
    title: 'Fetch WAHA session QR',
    description:
      'Fetches the QR code for the configured WAHA session. Returns an error payload while the session is already authenticated.',
    inputSchema: z.object({}).optional(),
    outputSchema: z.object({
      status: z.string(),
      qr: z.string().optional(),
      error: z.string().optional()
    })
  },
  async () => {
    const qr = await wahaClient.getSessionQr();
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
  }
);

server.registerTool(
  'waha.sendText',
  {
    title: 'Send WhatsApp text message',
    description:
      'Sends a plain text message through WAHA using the configured session.',
    inputSchema: z.object({
      chatId: z.string().min(5, 'chatId must be provided e.g. 123456789@c.us'),
      text: z.string().min(1, 'Message text cannot be empty')
    }),
    outputSchema: z.object({
      status: z.literal('sent')
    })
  },
  async ({ chatId, text }) => {
    await wahaClient.sendMessages({
      chatId,
      messages: [{ type: 'text', body: text }]
    });

    const payload = { status: 'sent' as const };
    return {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload
    };
  }
);

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

server.registerTool(
  'agent.generateReply',
  {
    title: 'Generate reply with OpenAI',
    description:
      'Generates WhatsApp-ready responses using OpenAI and optionally delivers them via WAHA.',
    inputSchema: replyInputSchema,
    outputSchema: replyOutputSchema
  },
  async ({ chatId, userMessage, context, send }) => {
    const replies = await generateReplies(userMessage, context);

    if (send) {
      if (!chatId) {
        throw new Error('chatId is required when send=true');
      }
      await wahaClient.sendMessages({
        chatId,
        messages: replies.map((body) => ({ type: 'text', body }))
      });
      const payload = { status: 'sent' as const, responses: replies, chatId };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
        structuredContent: payload
      };
    }

    const payload = { status: 'drafted' as const, responses: replies, chatId };
    return {
      content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload
    };
  }
);

async function generateReplies(
  userMessage: string,
  context: string[]
): Promise<string[]> {
  if (!hasOpenAI || !openaiClient) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const systemPrompt = await loadBusinessPrompt();
  const contextBlock = context.length
    ? context.join('\n')
    : 'Əlavə kontekst verilməyib.';

  try {
    const completion = await openaiClient.responses.create({
      model: env.OPENAI_MODEL,
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
  } catch (error) {
    logger.error({ err: error }, 'Failed to generate OpenAI response via MCP');
    throw new Error('OpenAI cavabı generasiya etmək mümkün olmadı.');
  }
}

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = Number.parseInt(process.env.MCP_PORT ?? env.MCP_PORT ?? '3030', 10);

app
  .listen(port, () => {
    logger.info({ port }, 'WAHA MCP server listening');
  })
  .on('error', (error) => {
    logger.error({ err: error }, 'Failed to start MCP server');
    process.exit(1);
  });
