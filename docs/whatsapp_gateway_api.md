# WhatsApp Gateway API Quick Reference

> Base URL: `http://localhost:3001`

All endpoints accept and return JSON. Media endpoints support either remote URLs or base64 payloads via the `file` object.

## Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns `{ "status": "ok" }`. |
| `GET` | `/ping` | Returns `{ "status": "pong" }`. |

## Session Lifecycle

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/server/status` | Gateway health plus active session name. |
| `GET` | `/api/server/version` | Gateway build identifier. |
| `POST` | `/api/sessions` | Updates webhook configuration for the default session. |
| `GET` | `/api/sessions` | Lists session metadata. |
| `GET` | `/api/sessions/{session}` | Fetch full session status. |
| `GET` | `/api/sessions/{session}/me` | Returns the authenticated WhatsApp identity. |
| `POST` | `/api/sessions/{session}/start` | Starts or resumes the session. |
| `POST` | `/api/sessions/{session}/stop` | Stops the session. |
| `GET` | `/api/{session}/auth/qr` | Returns `{ status, qr? }` for device pairing. |

## Messaging

Common body structure:

```json
{
  "session": "default",
  "chatId": "123456789@c.us",
  "text": "Sample message",
  "linkPreview": false
}
```

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/sendText` | Plain text delivery. |
| `POST` | `/api/sendLinkPreview` | `linkPreview: true` to request meta preview. |
| `POST` | `/api/sendImage` | Include `caption` and `file` descriptor. |
| `POST` | `/api/sendFile` | Generic document upload. |
| `POST` | `/api/sendVoice` | Accepts base64 or URL; set `"convert": true` for PTT waveform. |
| `POST` | `/api/sendVideo` | Optional `caption`. |
| `POST` | `/api/sendLocation` | Provide `latitude`, `longitude`, `title`. |
| `POST` | `/api/sendContactVcard` | `contacts` array with vCard payload. |

### Media Descriptor

```json
{
  "file": {
    "url": "https://example.com/image.jpg",
    "mimetype": "image/jpeg",
    "filename": "image.jpg"
  }
}
```

or

```json
{
  "file": {
    "base64": "data...",
    "mimetype": "audio/ogg; codecs=opus",
    "filename": "voice-note.ogg"
  }
}
```

## Typing & Receipts

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/startTyping` | Sets typing indicator. |
| `POST` | `/api/stopTyping` | Clears typing indicator. |
| `POST` | `/api/sendSeen` | Marks last messages as seen. |
| `PUT` | `/api/reaction` | Body: `{ "session": "default", "messageId": "...", "reaction": "❤️" }`. |

## Directory & Chats

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/{session}/profile` | Account profile metadata. |
| `GET` | `/api/{session}/profile/status` | Text status (may return 204/404). |
| `GET` | `/api/{session}/profile/picture` | Profile picture URL (may return 204/404). |
| `GET` | `/api/{session}/contacts` | Contact list. |
| `GET` | `/api/{session}/contacts/{chatId}` | Contact detail. |
| `GET` | `/api/{session}/contacts/about` | `chatId` query parameter. |
| `GET` | `/api/{session}/contacts/profile-picture` | `chatId` query parameter. |
| `GET` | `/api/{session}/contacts/check-exists` | `phone` query parameter. |
| `GET` | `/api/{session}/chats` | Chat overview. |
| `GET` | `/api/{session}/chats/overview` | Lightweight dashboard summary. |
| `GET` | `/api/{session}/chats/{chatId}` | Specific chat metadata and history. |

## Groups

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/{session}/groups` | List groups. |
| `GET` | `/api/{session}/groups/{groupId}` | Group metadata. |
| `GET` | `/api/{session}/groups/{groupId}/participants` | Participant roster. |
| `GET` | `/api/{session}/groups/{groupId}/invite-code` | Invite code (200 or 204). |

## Labels

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/{session}/labels` | Returns in-memory label registry. |
| `POST` | `/api/{session}/labels` | Body: `{ "name": "VIP", "colorHex": "#FF8800" }`. |
| `PUT` | `/api/{session}/labels/chats/{chatId}` | Body: `{ "labels": [{ "id": "<labelId>" }] }`. |
| `DELETE` | `/api/{session}/labels/{labelId}` | Deletes label. |

## Presence

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/{session}/presence` | List cached presence states. |
| `GET` | `/api/{session}/presence/{chatId}` | Fetch presence for a chat (creates entry if missing). |
| `GET` | `/api/{session}/presence/{chatId}/subscribe` | Marks chat as subscribed and returns the cached payload. |

## Webhooks

The gateway posts envelopes to configured webhook URLs:

```json
{
  "event": "message.any",
  "payload": {
    "id": "true_12345@c.us_ABC123",
    "chatId": "12345@c.us",
    "type": "chat",
    "body": "Hello!",
    "timestamp": 1733000000,
    "fromMe": false
  }
}
```

Consume these via `backend/src/routes/webhook.ts`, which buffers messages for the agent pipeline.
