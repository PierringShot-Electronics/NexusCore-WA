# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: Express + TypeScript services (`src/`), database adapters (`src/db/`), agent logic (`src/services/`), and seed scripts (`scripts/`).
- `dashboard/`: Next.js admin UI with pages under `pages/`, shared UI in `components/`, and global styles in `styles/`.
- `postgres/init/`: Boot-time SQL to enable `pgvector`, `pgcrypto`, and base schema; extend here for new migrations.
- `data/`: Source CSVs (`products.csv`) and other ingest artifacts; runtime media buffers mount inside Docker.
- `docs/`: Business prompts (`biznes.md`), integration specs, and reference PDFs—treat as the source of truth for agent behavior.

## Build, Test, and Development Commands
- `docker compose up --build`: Build and start the full stack locally.
- `npm run dev` (inside `backend/`): Hot-reload API server with `ts-node-dev`.
- `npm run dev` (inside `dashboard/`): Launch Next.js dashboard on port 3002.
- `npm run seed` (inside `backend/`): Load `data/products.csv` and generate embeddings.
- `bash scripts/smoke_test.sh`: Curl health checks for backend, WAHA, and Postgres.
- `python test_endpoints.py`: Lightweight verification of `/healthz` and WAHA `/health`.

## Coding Style & Naming Conventions
- TypeScript across backend; enforce 2-space indentation, `camelCase` for variables/functions, `PascalCase` for classes.
- Prefer `async`/`await` with explicit return types. Centralize configuration via `src/config/env.ts`.
- Use `pino` for structured logging; avoid `console.log`.
- For Next.js, keep component files under `PascalCase` directories and colocate module CSS when needed.

## Testing Guidelines
- Backend tests should live in `src/**/*.test.ts`; use Jest (add setup when suites are introduced) and mock external APIs.
- Dashboard tests belong in `__tests__/` with Playwright or React Testing Library.
- Smoke checks must pass (`scripts/smoke_test.sh`, `test_endpoints.py`) before publishing changes.

## Commit & Pull Request Guidelines
- Commit messages: imperative mood, max 72 chars (e.g., `Add Redis smart buffer service`).
- Scope commits narrowly; separate infrastructure, backend, and dashboard concerns.
- Pull requests require: concise summary, linked ticket/issue, validation evidence (tests run, screenshots for UI), and rollout checklist if infra changes.

## Security & Configuration Tips
- Never commit `.env`; copy from `.env.example` and inject secrets through Docker or CI variables.
- Keep WAHA API keys and OpenAI/Groq tokens in secret managers. Rotate on suspicion of leakage.
- Validate inbound payloads with Zod before processing; reject group messages unless explicitly whitelisted.
