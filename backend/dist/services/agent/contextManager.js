"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextManager = exports.ContextManager = void 0;
const postgres_1 = require("../../db/postgres");
class ContextManager {
    async ensureChat(externalId, customerName) {
        const client = await postgres_1.postgresPool.connect();
        try {
            await client.query('BEGIN');
            const existing = await client.query('SELECT id FROM chats WHERE external_id = $1 FOR UPDATE', [externalId]);
            if (existing.rows.length > 0) {
                await client.query('UPDATE chats SET updated_at = now(), customer_name = COALESCE($2, customer_name) WHERE id = $1', [existing.rows[0].id, customerName ?? null]);
                await client.query('COMMIT');
                return existing.rows[0].id;
            }
            const insert = await client.query('INSERT INTO chats (external_id, customer_name) VALUES ($1, $2) RETURNING id', [externalId, customerName ?? null]);
            await client.query('COMMIT');
            return insert.rows[0].id;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async appendMessage(options) {
        const { chatId, role, messageType, content } = options;
        await postgres_1.postgresPool.query('INSERT INTO messages (chat_id, role, message_type, content) VALUES ($1, $2, $3, $4)', [chatId, role, messageType, content]);
    }
    async getRecentMessages(chatId, limit = 10) {
        const result = await postgres_1.postgresPool.query(`SELECT id,
              role,
              message_type AS "messageType",
              content,
              created_at AS "createdAt"
       FROM messages
       WHERE chat_id = $1
       ORDER BY created_at DESC
       LIMIT $2`, [chatId, limit]);
        return result.rows;
    }
}
exports.ContextManager = ContextManager;
exports.contextManager = new ContextManager();
