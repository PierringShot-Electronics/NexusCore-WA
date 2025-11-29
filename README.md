# NexusCore-WA – PierringShot Electronics üçün Avtonom WhatsApp Agent Platforması

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7--alpine-DC382D?logo=redis&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-ready-2496ED?logo=docker&logoColor=white)

> **TL;DR**: WAHA + Express/TypeScript + PostgreSQL(pgvector) + Redis üzərində qurulan, GPT-4o & Groq modelləri ilə zənginləşdirilmiş multimodal satış və servis avtomatlaşdırma ekosistemi.

![NexusCore-WA Preview](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZybmRpeTduZDZkMjlzYzZnNXhjeTVzOXMwNTU3Z2h1NHRnNjBpZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o85xkPOu65qCIc3nq/giphy.gif)

## Layihəyə Baxış
- **Missiya:** PierringShot Electronics-in müştəri sorğularını, satış təkliflərini və texniki dəstəyi avtonom şəkildə idarə edən AI ekosistemi qurmaq.
- **Modalitələr:** Mətn, səs (Whisper/Transcribe), şəkil (Vision), video və sənəd qeydləri, vektor yaddaş (pgvector) və real vaxt rəqib analizi (Tap.az).
- **Guardrails:** `biznes.md` sənədi əsas ton/qayda mənbəyidir; STOP/START komandaları ilə insan müdaxiləsi dəstəklənir.

## Sistem Arxitekturası
```
docker-compose.yml
 ├─ postgres (pgvector + pgcrypto)
 ├─ redis (smart buffer & rate limit)
 ├─ waha (WhatsApp HTTP API gateway)
 ├─ app (Express + Agent + Tooling)
 └─ dashboard (Next.js operator UI)
```

| Qovluq | Təsvir |
| --- | --- |
| `backend/src/` | Express API, Redis buferi, multimodal media prosessoru, agent servis skeleti |
| `dashboard/` | Next.js idarə paneli, canlı status modulu |
| `postgres/init/` | `pgvector` aktivləşdirmə və başlanğıc sxem |
| `data/products.csv` | Məhsul kataloqu, `npm run seed` ilə vektorlara yüklənir |
| `docs/biznes.md` | Agentin əsas davranış qaydaları və ton tələbləri |

## İstifadə Qaydası (Addım-addım)
1. **Ətraf Mühit Hazırlığı**  
   - Docker Engine ≥ 24  
   - Docker Compose v2  
   - `OPENAI_API_KEY`, `GROQ_API_KEY`, `WAHA_API_KEY` dəyərlərini əldə edin.

2. **Konfiqurasiya**  
   ```bash
   cp .env.example .env
   # .env daxilində bütün API açarlarını və səsion parametrlərini yeniləyin
   ```

3. **Servisləri Başladın**  
   ```bash
   docker compose up --build
   ```
   - Backend: `http://localhost:3000/healthz`  
   - Dashboard: `http://localhost:3002`  
   - WAHA: `http://localhost:3001` (QR kodu dashboard `Admin → Session` panelində və ya `scripts/waha_session.sh` ilə)

4. **Məlumat Yüklənməsi (Opsional, məsləhətdir)**  
   ```bash
   docker compose run --rm app npm run seed
   ```
   `data/products.csv` faylını vektor bazasına yükləyir və embedding yaradır.

5. **Smoke Testləri**  
   ```bash
   bash scripts/smoke_test.sh
   python test_endpoints.py
   ```
   WAHA bağlantısı, backend sağlamlığı və Postgres əlaqəsini yoxlayır.

## Multimodal Prosessinq
- **Səs mesajları:** WAHA-dan gələn audio/PTT faylları avtomatik endirilir, OpenAI `gpt-4o-mini-transcribe` və ya ehtiyac olduqda Groq `whisper-large-v3` ilə transkripsiya olunur, nəticə kontekstə `[Səs mesajı] ...` kimi əlavə edilir.
- **Şəkil / Video:** Vision (GPT‑4o) ilk şəkili analiz edir; video mesajları və sənədlər üçün link + caption qeydləri yaradılır ki, operatorlar və LLM eyni məlumatı görsün.
- **Sənədlər:** PDF və digər faylların linkləri cavaba əlavə olunur, mətnə çevrilmə tələb olunarsa növbəti iterasiyada genişləndirilə bilər.

## İnkişaf & Skriptlər
```bash
# Backend inkişaf rejimi
cd backend
npm install
npm run dev

# Dashboard inkişaf rejimi
cd dashboard
npm install
npm run dev
```

## Kod Standartları
- **TypeScript:** 2 boşluq indent, `camelCase` funksiyalar, `PascalCase` siniflər. `pino` ilə strukturlaşdırılmış log yazın.
- **Next.js:** Komponentlər `PascalCase`, qlobal stillər `styles/globals.css`.
- **Zod** ilə daxil olan webhook payload-larını doğrulayın, qara siyahılarla qrup mesajlarını susdurun.

## Test & Keyfiyyət
- Gələcək Jest/Playwright sınaqları üçün struktur hazırdır (`backend/src/**/*.test.ts`, `dashboard/__tests__/`).
- Hər bir dəyişiklikdən sonra ən azı `npm run build` və smoke testləri keçməyi unutmayın.

## Təhlükəsizlik & Konfiqurasiya
- `.env` paylaşıla bilməz; yalnız `.env.example` commit olunur.
- WAHA/OpenAI/Groq açarlarını CI və ya gizli menecerlərdə saxlayın. `WAHA_API_KEY`-i default `admin` buraxmayın, dəyişdikdən sonra `sudo bash scripts/start_clean.sh && bash scripts/waha_session.sh`.
- Şübhəli mesajlarda `STOP` komandasını və dashboard “Takeover” funksiyasını istifadə edin.

## Git & Yayım Qaydası
- Commit mesajları: _əmr forması_ (`Add Redis smart buffer service`).
- PR-lar: qısa xülasə + bağlı issue + test nəticələri (UI dəyişikliklərində screenshot/GIF).
- Yayım: `docker compose up --build` və smoke testlər uğurla keçdikdən sonra prod mühitə tətbiq edin.

---
Hazırsınız? **`docker compose up --build`** yazın və NexusCore-WA ekosisteminə qoşulun!
