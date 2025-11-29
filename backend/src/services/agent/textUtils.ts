import type { BufferedMessagePayload } from '../buffer/smartBuffer';

function pickString(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length) {
      return trimmed;
    }
  }
  return null;
}

export function extractTextFromBufferedMessage(
  message: BufferedMessagePayload | null | undefined
): string | null {
  if (!message) {
    return null;
  }

  if (typeof message.text === 'string') {
    const trimmed = message.text.trim();
    if (trimmed.length) {
      return trimmed;
    }
  }

  return extractTextFromRaw(message.raw);
}

export function extractTextFromRaw(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  const candidates = [
    obj?.text,
    (obj?.text as Record<string, unknown> | undefined)?.body,
    obj?.body,
    obj?.caption,
    (obj?._data as Record<string, unknown> | undefined)?.body,
    (obj?._data as Record<string, unknown> | undefined)?.text,
    ((obj?._data as Record<string, unknown> | undefined)?.text as Record<
      string,
      unknown
    > | undefined)?.body,
    (obj?.message as Record<string, unknown> | undefined)?.body,
    (obj?.message as Record<string, unknown> | undefined)?.text,
    ((obj?.message as Record<string, unknown> | undefined)?.text as Record<
      string,
      unknown
    > | undefined)?.body,
    (obj?.message as Record<string, unknown> | undefined)?.conversation,
    obj?.conversation
  ];

  for (const candidate of candidates) {
    const result = pickString(candidate);
    if (result) {
      return result;
    }
  }

  return null;
}
