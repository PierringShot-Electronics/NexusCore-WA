# Role: Senior AI Solutions Architect & DevOps Lead
# Project: PierringShot Electronics - "WhatsCore.AI" (Maverick Edition)
# Objective: Build a Dockerized, Multi-Modal, Autonomous WhatsApp Agent System.

## 1. PROJECT CONTEXT & GOALS
You are building an advanced business automation system for an electronics repair and sales shop. The system must use the in-house **WhatsApp gateway (whatsapp-web.js)** for communication, **Node.js (TypeScript)** for logic, **PostgreSQL + pgvector** for memory, and **Redis** for buffering.

**Key capabilities:**
1.  **Multi-Modal:** Handle Text, Audio (Whisper), Images (Vision), Video (metadata) və sənəd paylaşımı.
2.  **Autonomous:** Use Tools to search the web (Google/Tap.az), lookup internal DB, and calculate prices.
3.  **Resilient:** Self-healing Docker containers, message buffering, and smoke tests.
4.  **Business Logic:** Dynamic pricing based on competitor analysis (see `biznes.md`).

## 2. TECH STACK (Strict)
-   **Runtime:** Node.js (v20+) with TypeScript.
-   **Framework:** Express.js (API & Webhook handling).
-   **Database:** PostgreSQL 16 (with `pgvector` extension enabled).
-   **Queue/Cache:** Redis (Alpine).
-   **WhatsApp Bridge:** Internal WWeb.js gateway service (Docker).
-   **AI Engine:** OpenAI GPT-4o (Main Brain) + Groq/Llama3 (Fast Routing/Summary).
-   **Tools:** Puppeteer (Web Scraping), Axios, OpenAI SDK.
-   **Frontend:** React/Next.js (Simple Admin Dashboard for logs & config).

## 3. CORE ARCHITECTURE & FEATURES

### A. The "Smart Buffer" (Debounce Logic)
*Crucial for WhatsApp User Experience.*
-   **Problem:** Users send multiple short messages ("Hi", "I have a problem", "with my PC") və tez-tez səs/video statusları paylaşır.
-   **Solution:**
    -   On incoming message, push to Redis List: `chat_buffer:{userId}`.
    -   Reset an 8-second countdown timer.
    -   If timer expires (silence), aggregate all buffered messages into one context.
    -   Audio/PTT fayllar WhatsApp gateway-dən endirilir, `mediaProcessor` OpenAI `gpt-4o-mini-transcribe` (fallback Groq `whisper-large-v3`) ilə transkripsiya edir və `[Səs mesajı] ...` kimi kontekstə daxildir.
    -   Image/video/document message-ları üçün link + caption qeydləri yaradılır ki, agent Vision alətlərinə və ya operatorlara ötürə bilsin.

### B. The AI Agent & Tool Use
The Agent must decide to use tools based on the `biznes.md` rules.
-   **Tool: `lookup_internal_stock(query)`**: Search `products` table via vector similarity + keyword.
-   **Tool: `search_competitors(product_name)`**:
    -   Use Google Search or scrape `tap.az` (Azerbaijani marketplace).
    -   Extract price range for the specific model.
-   **Tool: `analyze_image(url)`**: Use GPT-4o Vision to identify laptop model/screen damage from photos (video mesajı varsa ilk frame üçün əlavə analiz hazırlamaq planlıdır).
-   **Tool: `calculate_offer(cost, competitor_price)`**:
    -   Logic: Offer = `CompetitorPrice - 5%` (Ensure `Offer > Cost + Margin`).

### C. The Workflow (Example: Screen Repair)
1.  User: sends photo of broken laptop.
2.  **Vision Agent:** Identifies "Asus X515".
3.  **Agent:** Calls `search_web("Asus X515 screen specs")` -> Finds "30-pin Slim LED".
4.  **Agent:** Calls `lookup_internal_stock` -> Finds "30-pin Slim" Cost: 60 AZN.
5.  **Agent:** Calls `search_competitors("Asus X515 ekran")` -> Finds Market Price: 110 AZN.
6.  **Agent:** Calculates Offer -> (110 - 10) = 100 AZN.
7.  **Reply:** "Sizin model Asus X515-dir. Ekranı bizdə var. Bazarda 110 AZN-dir, amma biz sizə 100 AZN-ə təklif edirik + zəmanət."

### D. Admin Dashboard & Monitoring
-   **QR Code:** Display WhatsApp gateway Auth QR code if session is `STOPPED`.
-   **Live Logs:** Stream logs via WebSocket.
-   **Manual Override:** Button to "Stop AI" for a specific chat (Handover to Human).

## 4. IMPLEMENTATION PLAN (Step-by-Step)

### Phase 1: Infrastructure (Docker)
Create `docker-compose.yml` with:
-   `waha`: Volume mapped for sessions.
-   `postgres`: With pgvector init script.
-   `redis`: Standard config.
-   `app`: Your Node.js application.
-   `dashboard`: The Frontend.
-   Media fayllarının saxlanması üçün WhatsApp gateway konteynerinin sessiya volumunu qoruyun.

### Phase 2: Backend Core
1.  Setup Express server with `webhook` endpoint.
2.  Implement the **Redis Buffer/Debounce** middleware.
3.  Create the **Context Manager** (fetch last 10 messages from DB).
4.  `mediaProcessor` modulunu əlavə et ki, audio/video/document mesajları agent kontekstinə çevrilsin.

### Phase 3: AI Logic & Tools
1.  Implement `AgentService` using OpenAI Function Calling.
2.  Build `biznes.md` parser to inject system instructions dynamically.
3.  Implement the Tools (Scraper, DB Search).

### Phase 4: Data & Testing
1.  Create `seed.ts` to ingest `products.csv` into Vector DB.
2.  Create `smoke_test.sh`:
    -   Check if the WhatsApp gateway is connected.
    -   Check DB write/read.
    -   Check OpenAI API connectivity.
3.  `whatsapp_gateway_session.sh` skriptinə sessiyanın avtomatik yaradılması və QR çıxarışı üçün rely et.

## 5. EXECUTION INSTRUCTION
**Start immediately.**
1.  Scaffold the directory structure.
2.  Create the `docker-compose.yml` first.
3.  Then build the Node.js backend to handle the "Buffer" logic.
4.  Use the provided `biznes.md` file as the **System Prompt Source of Truth**.
5.  Ensure all secrets (API Keys) are loaded from `.env`.

**GO.**
