import axios from 'axios';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { toFile } from 'openai/uploads';
import type { BufferedMessagePayload } from '../buffer/smartBuffer';
import { env } from '../../config/env';
import { hasOpenAI, openaiClient, hasGroq, groqClient } from '../../config/ai';
import { logger } from '../../utils/logger';
import { recordModelUsage } from '../telemetry/costTracker';

export interface MediaProcessingSummary {
  audioTranscripts: Array<{ id: string; transcript: string }>;
  videoNotes: Array<{ id: string; note: string }>;
  documentNotes: Array<{ id: string; note: string }>;
}

interface DownloadResult {
  buffer: Buffer;
  mimeType?: string;
  filename: string;
}

export async function processMediaMessages(
  messages: BufferedMessagePayload[],
  chatId?: string
): Promise<MediaProcessingSummary> {
  const audioMessages = messages.filter(
    (message) => message.type === 'audio' && message.audioUrl
  );
  const videoMessages = messages.filter(
    (message) => message.type === 'video' && message.videoUrl
  );
  const documentMessages = messages.filter(
    (message) => message.type === 'document' && message.documentUrl
  );

  const audioTranscripts: Array<{ id: string; transcript: string }> = [];

  for (const message of audioMessages) {
    try {
      const download = await downloadMedia(message.audioUrl!, message.mimeType);
      if (!download) {
        logger.warn(
          { messageId: message.id },
          'Failed to download audio attachment'
        );
        continue;
      }

      const transcript = await transcribeAudioAttachment(download, chatId);
      if (transcript) {
        audioTranscripts.push({ id: message.id, transcript });
      }
    } catch (error) {
      logger.warn(
        { err: error, messageId: message.id },
        'Audio transcription failed'
      );
    }
  }

  const videoNotes = videoMessages.map((message) => {
    const caption = message.caption?.trim();
    const link = normalizeMediaUrl(message.videoUrl!);
    const noteParts = [
      'Video mesajı alındı.',
      caption ? `Qeyd: ${caption}` : null,
      link ? `Fayl: ${link}` : null
    ].filter(Boolean);

    return {
      id: message.id,
      note: noteParts.join(' ')
    };
  });

  const documentNotes = documentMessages.map((message) => {
    const caption = message.caption?.trim();
    const link = normalizeMediaUrl(message.documentUrl!);
    const noteParts = [
      'Sənəd paylaşıldı.',
      caption ? `Qeyd: ${caption}` : null,
      link ? `Fayl: ${link}` : null
    ].filter(Boolean);

    return {
      id: message.id,
      note: noteParts.join(' ')
    };
  });

  return {
    audioTranscripts,
    videoNotes,
    documentNotes
  };
}

async function downloadMedia(
  url: string,
  mimeType?: string
): Promise<DownloadResult | null> {
  const targetUrl = normalizeMediaUrl(url);
  if (!targetUrl) {
    return null;
  }

  try {
    const response = await axios.get<ArrayBuffer>(targetUrl, {
      responseType: 'arraybuffer',
      headers: {
        'X-Api-Key': env.WAHA_API_KEY
      },
      timeout: 15_000
    });

    const inferredMime = mimeType ?? response.headers['content-type'];
    const filename = buildAttachmentFilename(targetUrl, inferredMime);

    return {
      buffer: Buffer.from(response.data),
      mimeType: inferredMime,
      filename
    };
  } catch (error) {
    logger.warn({ err: error, url: targetUrl }, 'Failed to download media');
    return null;
  }
}

async function transcribeAudioAttachment(
  attachment: DownloadResult,
  chatId?: string
): Promise<string | null> {
  const preferredMime =
    attachment.mimeType && typeof attachment.mimeType === 'string'
      ? attachment.mimeType
      : 'audio/ogg';

  if (hasOpenAI && openaiClient) {
    try {
      const file = await toFile(attachment.buffer, attachment.filename, {
        type: preferredMime
      });
      const result = (await openaiClient.audio.transcriptions.create({
        file,
        model: env.OPENAI_TRANSCRIPTION_MODEL,
        response_format: 'verbose_json'
      })) as {
        text?: string;
        segments?: Array<{ text: string }>;
        usage?: {
          prompt_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
        };
      };

      const text =
        typeof result.text === 'string'
          ? result.text
          : result.segments?.map((segment) => segment.text).join(' ');

      if (text) {
        logger.debug('Audio transcribed via OpenAI model.');
        if (result.usage) {
          await recordModelUsage({
            chatId: chatId ?? 'media',
            provider: 'openai',
            model: env.OPENAI_TRANSCRIPTION_MODEL,
            usage: {
              promptTokens: result.usage.prompt_tokens ?? result.usage.total_tokens
            }
          });
        }
        return text.trim();
      }
    } catch (error) {
      logger.warn({ err: error }, 'OpenAI transcription failed');
    }
  }

  if (hasGroq && groqClient) {
    try {
      const file = await toFile(attachment.buffer, attachment.filename, {
        type: preferredMime
      });
      const result = (await groqClient.audio.transcriptions.create({
        file,
        model: env.GROQ_TRANSCRIPTION_MODEL
      })) as { text?: string; usage?: { prompt_tokens?: number; completion_tokens?: number } };

      if (result?.text) {
        logger.debug('Audio transcribed via Groq fallback model.');
        if (result.usage) {
          await recordModelUsage({
            chatId: chatId ?? 'media',
            provider: 'groq',
            model: env.GROQ_TRANSCRIPTION_MODEL,
            usage: {
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens
            }
          });
        }
        return result.text.trim();
      }
    } catch (error) {
      logger.warn({ err: error }, 'Groq transcription fallback failed');
    }
  }

  return null;
}

function normalizeMediaUrl(url: string): string | null {
  try {
    const parsed = new URL(url, env.WAHA_BASE_URL);
    return parsed.toString();
  } catch {
    return null;
  }
}

function buildAttachmentFilename(url: string, mimeType?: string): string {
  const existingExt = extname(new URL(url).pathname);
  if (existingExt) {
    return `${randomUUID()}${existingExt}`;
  }

  const extension = inferExtensionFromMime(mimeType);
  return `${randomUUID()}${extension}`;
}

function inferExtensionFromMime(mimeType?: string): string {
  if (!mimeType) {
    return '.bin';
  }

  if (mimeType.includes('ogg')) {
    return '.ogg';
  }
  if (mimeType.includes('mpeg')) {
    return '.mp3';
  }
  if (mimeType.includes('wav')) {
    return '.wav';
  }
  if (mimeType.includes('mp4')) {
    return '.mp4';
  }
  if (mimeType.includes('pdf')) {
    return '.pdf';
  }

  return '.bin';
}
