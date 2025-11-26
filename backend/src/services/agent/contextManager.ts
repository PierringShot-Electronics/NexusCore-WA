import type { PoolClient } from 'pg';
import { postgresPool } from '../../db/postgres';

export interface PersistedMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  messageType: string;
  content: Record<string, unknown>;
  createdAt: Date;
}

export class ContextManager {
  public async ensureChat(
    externalId: string,
    customerName?: string
  ): Promise<string> {
    const client = await postgresPool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query<{ id: string }>(
        'SELECT id FROM chats WHERE external_id = $1 FOR UPDATE',
        [externalId]
      );

      if (existing.rows.length > 0) {
        const existingRow = existing.rows[0];
        if (!existingRow) {
          throw new Error('Invariant violation: expected existing chat row');
        }
        await client.query(
          'UPDATE chats SET updated_at = now(), customer_name = COALESCE($2, customer_name) WHERE id = $1',
          [existingRow.id, customerName ?? null]
        );
        await client.query('COMMIT');
        return existingRow.id;
      }

      const insert = await client.query<{ id: string }>(
        'INSERT INTO chats (external_id, customer_name) VALUES ($1, $2) RETURNING id',
        [externalId, customerName ?? null]
      );

      await client.query('COMMIT');
      const insertedRow = insert.rows[0];
      if (!insertedRow) {
        throw new Error('Failed to create chat record');
      }
      return insertedRow.id;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async appendMessage(options: {
    chatId: string;
    role: 'user' | 'assistant' | 'system';
    messageType: string;
    content: Record<string, unknown>;
  }): Promise<void> {
    const { chatId, role, messageType, content } = options;
    await postgresPool.query(
      'INSERT INTO messages (chat_id, role, message_type, content) VALUES ($1, $2, $3, $4)',
      [chatId, role, messageType, content]
    );
  }

  public async getRecentMessages(chatId: string, limit = 10): Promise<PersistedMessage[]> {
    const result = await postgresPool.query<PersistedMessage>(
      `SELECT id,
              role,
              message_type AS "messageType",
              content,
              created_at AS "createdAt"
       FROM messages
       WHERE chat_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [chatId, limit]
    );

    return result.rows;
  }
}

export const contextManager = new ContextManager();
