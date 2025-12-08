# WWeb.js Gateway Overview

## Current Architecture

- **Gateway Service (`gateway/`)** – Ships an embedded [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js) client plus an Express API surface. Chromium is bundled in the Docker image and session state is persisted under `data/whatsapp-gateway/session/`.
- **Backend integration** – The agent stack calls the gateway via `backend/src/services/agent/whatsappGatewayClient.ts`. Webhooks emitted by the gateway are normalized through `parseGatewayWebhookBody` and fed into the smart buffer.
- **MCP Tools** – `backend/src/mcp/server.ts` exposes `wweb.*` tools so the Model Context Protocol bridge can inspect QR status, send messages, or draft replies without touching the legacy bridge.
- **Admin surfaces & tests** – Admin routes, CLI scripts, and the end-to-end test runner (`scripts/test_endpoints.py`) now exercise the WWeb.js gateway exclusively. The test suite covers all messaging, label, and presence endpoints to guarantee parity.

## API Surface (HTTP)

| Category | Endpoint | Notes |
| --- | --- | --- |
| Health | `GET /health`, `GET /ping` | Liveness probes for the gateway container. |
| Sessions | `GET /api/sessions`, `GET /api/sessions/{session}`, `GET /api/sessions/{session}/me` | Inspect current session metadata. |
| Lifecycle | `POST /api/sessions/{session}/start`, `POST /api/sessions/{session}/stop`, `GET /api/{session}/auth/qr` | Control device pairing and restart flows. |
| Messaging | `POST /api/sendText`, `/sendLinkPreview`, `/sendImage`, `/sendFile`, `/sendVoice`, `/sendVideo`, `/sendLocation`, `/sendContactVcard` | Unified payload contract with optional base64 or URL-based media descriptors. |
| Typing & Receipts | `POST /api/startTyping`, `/stopTyping`, `/sendSeen`, `PUT /api/reaction` | Auxiliary chat UX helpers. |
| Directory | `GET /api/{session}/profile`, `/profile/status`, `/profile/picture`, `/contacts`, `/contacts/{chatId}`, `/contacts/about`, `/contacts/profile-picture`, `/contacts/check-exists` | Mirrors WhatsApp Web capabilities. |
| Chats | `GET /api/{session}/chats`, `/chats/overview`, `/chats/{chatId}` | Fetch inbox snapshots for dashboards and agents. |
| Groups | `GET /api/{session}/groups`, `/groups/{id}`, `/groups/{id}/participants`, `/groups/{id}/invite-code` | Read-only group exploration. |
| Labels | `GET /api/{session}/labels`, `POST /api/{session}/labels`, `PUT /api/{session}/labels/chats/{chatId}`, `DELETE /api/{session}/labels/{labelId}` | Ephemeral in-memory label registry used for testing. |
| Presence | `GET /api/{session}/presence`, `/presence/{chatId}`, `/presence/{chatId}/subscribe` | Lightweight presence registry that feeds the dashboard test suite. |

Refer to `docs/whatsapp_gateway_api.md` for a detailed description of request/response bodies.

## Migration Status

- ✅ WWeb.js gateway containerised with Chromium dependencies and persisted sessions.
- ✅ Backend, MCP, and automation scripts refactored to call the new gateway.
- ✅ Legacy bridge-specific code paths, environment variables, and scripts removed.
- ✅ Integration suite (`scripts/test_endpoints.py`) passes all 24 messaging, label, and presence checks against the WWeb.js runtime.
- ✅ Documentation, README, and `.env.example` updated to highlight the new architecture.

## Next Steps

1. **Observability** – Implement the telemetry roadmap in `docs/todo.md` (real-time workflow events, cost dashboards, SSE feeds).
2. **Persistent Labels & Presence** – Replace the in-memory stores with a shared Redis/Postgres backing service if long-lived state is required.
3. **Advanced Media** – Expose sticker creation, polls, and high-definition media helpers now supported by whatsapp-web.js `1.34.2`.
4. **OpenAPI Refresh** – Keep `docs/whatsapp_gateway_api.md` and the OpenAPI document in sync as new endpoints land.
