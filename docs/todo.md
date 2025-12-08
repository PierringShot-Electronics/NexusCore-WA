# NexusCore-WA Realtime Telemetry & Cost Dashboard TODO

> _Son yoxlamanın tarixi:_ **01 December 2025**

## 🔁 Realtime Workflow Vizualizasiya
- [x] Backend agent pipeline mərhələləri üçün strukturlu “event” çıxışı hazırlamaq (`buffer`, `intent`, `persona`, `tools`, `response`, `send`)
  - [x] Hər event üçün payload (chatId, persona, model, sürə, nəticə) tərtib et
  - [x] Eventləri SSE/WebSocket yayıncısına ötürmək üçün servis (Node EventEmitter + Redis pub/sub?)
- [x] Dashboard-da “Flow Canvas” səhifəsi (React Flow və ya oxşarı)
  - [x] Node/edge sxemi: giriş → niyyət → persona → alətlər → cavab
  - [x] Real-time işıqlandırma/animasiya (event gələndə node highlight/glow)
  - [x] Qısa input/output snippet-ləri və status badge (success/fail)
  - [ ] Mobil görünüş üçün sadələşdirilmiş timeline fallback
- [ ] Event replay / tarixçə paneli (son N mesaj üçün təkrar izləmə)

## 💵 Token & Qiymət Telemetriya
- [ ] OpenAI + Groq cavablarında `usage` metriklərini yakalamaq (input/output tokens)
- [ ] Modellərə görə qiymət cədvəli (konfiqurable JSON)
  - [ ] Env-də qiymət override imkanı (`MODEL_PRICING_OVERRIDES`)
- [ ] Məlumatların saxlanması
  - [ ] Qısa müddətli saxlama (Redis stream? Postgres table?)
  - [ ] Sürətli sorğular üçün son 1h/24h aggregation
- [ ] API endpointləri
  - [ ] `GET /api/telemetry/summary` (toplam tokenlər, xərc, model üzrə breakdown)
  - [ ] `GET /api/telemetry/conversations?chatId=...`
  - [x] `GET /api/telemetry/stream` (SSE)
- [ ] Dashboard “Cost Monitor” səhifəsi
  - [ ] Model-fokuslu bar/line chartlar
  - [ ] Workflow icrası üçün “input vs output tokens” kartı
  - [ ] Son əməliyyatların cədvəli + status + xərc

## ⚙️ Admin & Konfiqurasiya
- [ ] EnvUI-yə qiymət cədvəli parametrini əlavə et
- [ ] Telemetriya üçün aktivləşdirmə/dəaktivləşdirmə konfiqi (`TELEMETRY_ENABLED`)
- [ ] Role-based əldə (yalnız admin istifadəçilər workflow/cost panelini görə bilsin)

## 🧪 Test & Monitorinq
- [ ] Backend unit/integration testləri (event emitter, pricing hesablaması)
- [ ] Yeni `scripts/test_endpoints.py` üçün isteğe bağlı “sample traffic generator” rejimi
- [ ] Flow vizualizasiyası üçün e2e (Playwright) snapshot testi
- [ ] Log-larda səhv hadisələri üçün alert (məs: telemetriya push alınmadı)

## 📚 Sənədləşmə
- [ ] `docs/telemetry.md` – arxitektura, event struktur, API-lərin izahı
- [ ] Dashboard istifadəçi quidası (workflow monitor necə oxunur)

---

### ✅ Xüsusi Qeydlər & Qərarlar
- Vizual komponent üçün hansı kitabxana? (React Flow / custom D3?)
- Telemetriya saxlanması üçün Redis mövcuddurmu, yoxsa Postgres istifadə edilməlidir?
- SSE gecikməsi: 1 saniyəlik flush kifayətdirmi?
- Əlavə analitik (per-persona, per-tool) lazım olacaqmı?

_(Bu TODO faylını mütəmadi yeniləyək – yeni addımlar əlavə etməkdən çəkinmə.)_
