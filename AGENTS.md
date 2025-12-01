# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: Express + TypeScript services (`src/`), database adapters (`src/db/`), agent logic (`src/services/`), multimodal media prosessoru (`src/services/agent/mediaProcessor.ts`), və seed scripts (`scripts/`).
- `dashboard/`: Next.js admin UI with pages under `pages/`, shared UI in `components/`, and global styles in `styles/`.
- `postgres/init/`: Boot-time SQL to enable `pgvector`, `pgcrypto`, and base schema; extend here for new migrations.
- `data/`: Source CSVs (`products.csv`), the primary business prompt (`biznes.md`), and other ingest artifacts; runtime media buffers mount inside Docker.
- `docs/`: Integration specs, and reference PDFs—treat as the source of truth for agent behavior alongside `data/biznes.md`.

## Build, Test, and Development Commands
- `docker compose up --build`: Build and start the full stack locally.
- `npm run dev` (inside `backend/`): Hot-reload API server with `ts-node-dev`.
- `npm run dev` (inside `dashboard/`): Launch Next.js dashboard on port 3002.
- `npm run seed` (inside `backend/`): Load `data/products.csv` and generate embeddings.
- `bash scripts/smoke_test.sh`: Curl health checks for backend, WAHA, and Postgres.
- `python scripts/test_endpoints.py`: Comprehensive checks of `/healthz`, WAHA `/health`, and message/media endpoints.
- `bash scripts/waha_session.sh`: WAHA sessiyasını yarat və başlat, QR kodu çıxar.
- `bash scripts/postgres_refresh_collation.sh`: Postgres collation versiyasını yenilə (glibc mismatch xəbərdarlıqlarını aradan qaldırır).
- `npm run mcp:dev` (inside `backend/`): MCP serverini (`/mcp`) lokalda işə salır, WAHA ↔ OpenAI alətlərini təqdim edir.

## Coding Style & Naming Conventions
- TypeScript across backend; enforce 2-space indentation, `camelCase` for variables/functions, `PascalCase` for classes. Multimodal kollektorlar (`mediaProcessor`) kimi genişləndirmələr üçün `src/services/agent/` daxilində yeni modullar istifadə et.
- Prefer `async`/`await` with explicit return types. Centralize configuration via `src/config/env.ts`.
- Use `pino` for structured logging; avoid `console.log`.
- For Next.js, keep component files under `PascalCase` directories and colocate module CSS when needed.

## Testing Guidelines
- Backend tests should live in `src/**/*.test.ts`; use Jest (add setup when suites are introduced) and mock external APIs.
- Dashboard tests belong in `__tests__/` with Playwright or React Testing Library.
- Smoke checks must pass (`scripts/smoke_test.sh`, `scripts/test_endpoints.py`) before publishing changes.

## Commit & Pull Request Guidelines
- Commit messages: imperative mood, max 72 chars (e.g., `Add Redis smart buffer service`).
- Scope commits narrowly; separate infrastructure, backend, and dashboard concerns.
- Pull requests require: concise summary, linked ticket/issue, validation evidence (tests run, screenshots for UI), and rollout checklist if infra changes.

## Security & Configuration Tips
- Never commit `.env`; copy from `.env.example` and inject secrets through Docker or CI variables.
- Keep WAHA API keys and OpenAI/Groq tokens in secret managers. Rotate on suspicion of leakage və WAHA dashboard/swagger hesablarında default istifadəçi/parol saxlamayın.
- MCP endpointini (`backend/src/mcp/server.ts`) yalnız daxili trafikin girişi üçün açın, ehtiyac olduqda əlavə autentifikasiya qatları tətbiq edin.
- Səs/video fayllarını yalnız WAHA hostundan endir; üçüncü tərəf URL-lərini blokla.
- Validate inbound payloads with Zod before processing; reject group messages unless explicitly whitelisted.

## Agent Update Notes

### Nə dəyişdi
- Audio və vizual siqnallar üçün agent məntiqi yeniləndi: yeni niyyət heuristikası indi “məhsul”, “qiymət”, “təmir”, “termopasta” kimi açar sözləri avtomatik tanıyır və əl ilə şikayət və ya operator tələbi gəlmədikcə default olaraq handover vermir; bax: `backend/src/services/agent/agentService.ts:180-259`.
- Şəkil aləti artıq ilk 3 fotonu JSON cavabla emal edir, OCR və zədə qeydlərini çıxarır, nəticələr `ToolSummary` daxilində çoxsaylı giriş kimi saxlanılır; bax: `backend/src/services/agent/toolExecutor.ts:20-55`, `backend/src/services/tools/imageAnalysis.ts:1-155`, `backend/src/services/agent/responseBuilder.ts:140-217`.
- Persona seçimi və prompt orkestrasiyası yeni multimodal siqnalları nəzərə alır, cavablar məcburi şəkildə səs transkriptlərini və foto analizini inteqrasiya edir; bax: `backend/src/services/agent/personaStrategy.ts:32-137`, `backend/src/services/agent/responseBuilder.ts:140-215`.
- Konfiqurasiya və sənədlər yeniləndi: default transkripsiya modeli indi `OpenAI whisper-large-v3-turbo`, OpenAI/Groq ardıcıllığının necə işlədiyi `README.md:9-87` və `docs/documentations.md:61-93` daxilində izah olunub; bax: `backend/src/config/env.ts:34-52`.

### Testlər
- `npm run build`
- `python3 scripts/test_endpoints.py` çalışdırılmadı – backend konteyneri olmadan işləmir; docker stack yenidən başlatdıqdan sonra icra et.

### Növbəti addım
- Stack-i `bash scripts/start_clean.sh` ilə yenidən qaldır və real WhatsApp söhbətində həm audio, həm də foto göndərərək davranışı yoxla; nəticəni `docker logs -f nexuscore-wa-app-1` üzərindən izləmək tövsiyə olunur.

### Qeydlər
- Yeni commit: `feature/waha-mcp-integration` üzərində `e91c4fb Improve multimodal agent heuristics` (remote-a push olunub). `main` hazırda `2c31909` commitindədir; ehtiyac varsa bu dəyişiklikləri ora merge et.
- Səsli mesajlarda Anadolu/Azərbaycan ləhcəsi üçün daha dəqiq transkript almaq istəyirsənsə `OPENAI_TRANSCRIPTION_MODEL` üçün `.env` daxilində `whisper-large-v3-turbo` saxla; Groq açarı varsa, sistem avtomatik fallback edəcək.
