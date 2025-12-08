# 🌌 NexusCore-WA – Autonomous WhatsApp Intelligence for PierringShot Electronics

![NexusCore Banner](https://via.placeholder.com/1200x320.png?text=NexusCore-WA+Autonomous+Agent)

<p align="center">
  <a href="https://github.com/PierringShot-Electronics/NexusCore-WA/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-CC0_1.0-lightgrey?style=for-the-badge" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" alt="Build Status" />
  <img src="https://img.shields.io/badge/Version-0.9.0-blueviolet?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&style=for-the-badge" alt="Docker Ready" />
  <img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20TypeScript%20%7C%20Next.js-0f172a?style=for-the-badge" alt="Tech Stack" />
</p>

> **NexusCore-WA** is PierringShot Electronics' end-to-end autonomous service and sales assistant: a multimodal WhatsApp brain that listens, watches, reasons, and responds with GPT-5-ready intelligence.

---

## 📚 Table of Contents
- [🚀 Features](#-features)
- [🛠️ Installation](#️-installation)
- [▶️ Usage](#️-usage)
- [🧱 Architecture Overview](#-architecture-overview)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Features
- 🤖 **Autonomous Agent Orchestration** – buffer, intent, persona, tooling, response, and delivery stages instrumented with telemetry.
- 🧠 **Multimodal Understanding** – Whisper/Groq transcription for audio, GPT-4o & vision fallbacks for images/videos, semantic product recall via pgvector.
- 📦 **Ops-Ready Deployments** – Docker Compose stack (Postgres + pgvector, Redis, WWeb.js gateway, Express backend, Next.js dashboard).
- 📈 **Realtime Insights** – SSE-powered Flow Canvas dashboard shows live pipeline status, persona/model picks, and execution latencies.
- 🛡️ **Guardrails & Handover** – configurable business tone (`data/biznes.md`), human handoff commands, and structured clarifications.

## 🛠️ Installation
1. **Clone & Prepare**
   ```bash
   git clone https://github.com/PierringShot-Electronics/NexusCore-WA.git
   cd NexusCore-WA
   cp .env.example .env
   ```
2. **Configure Secrets**
   - Fill in `OPENAI_*`, optional `GROQ_*`, WhatsApp gateway credentials, and agent model overrides inside `.env`.
   - Adjust telemetry controls (`TELEMETRY_ENABLED`, `TELEMETRY_REDIS_STREAM`, `TELEMETRY_HISTORY_LIMIT`) as needed.
3. **Launch the Stack**
   ```bash
   docker compose up --build
   ```
4. **(Optional) Seed Product Data**
   ```bash
   docker compose run --rm app npm run seed
   ```

## ▶️ Usage
- 🌀 **Dashboard** – visit `http://localhost:3002` for the operator console (`/overview`, `/telemetry`, `/agent`, `/environment`).
- 💬 **WhatsApp Gateway** – scan the QR from the dashboard or `scripts/whatsapp_gateway_session.sh` to pair the agent number.
- ✅ **Smoke Tests** – run `bash scripts/smoke_test.sh` and `python scripts/test_endpoints.py` to validate gateway ↔ backend ↔ database links.
- 🧪 **Telemetry Stream** – subscribe to `http://localhost:3000/telemetry/stream` for live pipeline events (perfect for observability dashboards).

## 🧱 Architecture Overview
```
docker-compose.yml
 ├─ postgres          # pgvector + pgcrypto extensions
 ├─ redis             # smart buffer, rate limiting, telemetry stream
 ├─ wweb              # WhatsApp Web JS gateway (QR auth, media downloads)
 ├─ app               # Express + agent orchestration + tool executors
 └─ dashboard         # Next.js operator UI (Flow Canvas, config, logs)
```
Key directories:
- `backend/src/services/agent/` – intent classification, persona strategy, tool executor, response builder.
- `backend/src/services/telemetry/` – event bus, Redis persistence, SSE endpoints.
- `dashboard/pages/` – modular admin views (`overview`, `telemetry`, `agent`, `environment`).
- `docs/` – product knowledge base, integration guides, and roadmap notes.

## 🗺️ Roadmap
- [x] Realtime telemetry stream & Flow Canvas UI
- [x] Multimodal media ingestion (audio transcription, vision analysis, document notes)
- [ ] Token usage & cost monitor dashboard
- [ ] Conversational memory refinement and proactive follow-ups
- [ ] Automated regression suite for gateway + agent workflows

## 🤝 Contributing
1. Fork the repository and create a feature branch.
2. Follow the commit convention (`feat:`, `fix:`, `docs:`, `chore:` …).
3. Keep the `TODO.md` state-of-truth updated (task checklist).
4. Open a pull request with screenshots/logs for UI or gateway changes.

## 📄 License
Distributed under the CC0 1.0 Universal License. See [`LICENSE`](LICENSE) for details.

---

> 💡 **Pro tip:** Keep an eye on `/telemetry/stream` + `/overview` during live WhatsApp sessions to see the pipeline glow as it reasons in real time!
