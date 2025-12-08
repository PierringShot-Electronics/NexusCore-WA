# OpenAI Model Constellation Guide

_Updated: 01 December 2025_

Bu sənəd NexusCore-WA ekosistemində istifadə olunan (və ya inteqrasiya üçün planlaşdırılan) OpenAI modellərinin yüksək səviyyəli xəritəsini təqdim edir. Məqsəd – router memarlığı ilə müxtəlif tapşırıqlar üçün ən uyğun modeli seçmək, xərci optimallaşdırmaq və multimodal davranışı qorumaqdır. Rəsmi model məlumatları OpenAI-nin model bələdçisi və qiymət cədvəli ilə uzlaşdırılıb.citeturn0search2turn2search2

> **Qeyd:** Standart konfiqurasiya `gpt-4o` / `gpt-4o-mini` ailəsinə söykənir. `gpt-5.*` modelləri yalnız həmin tenant üçün açıqdırsa istifadə oluna bilər; əvvəlcədən `curl https://api.openai.com/v1/models` ilə mövcudluğu təsdiqləyin.

## 1. GPT-5 Seriyası

| Model | Əsas istifadə məqsədi | Effektiv təyinat |
| --- | --- | --- |
| `gpt-5.1` | Konfiqurasiya edilə bilən reasoning ilə ən mürəkkəb agent tapşırıqları, geniş alət dəsti. | "Defolt orkestrator" – yüksək səviyyəli korporativ agent beyni.citeturn0search2turn2search1 |
| `gpt-5` | GPT-5.1-dən əvvəlki bayraqdar, tam agentik/kod tapşırıqları. | "Legacy orkestrator" – GPT-5.1 olmayan tenantlar üçün.citeturn0search3turn2search1 |
| `gpt-5-mini` | Sürətli və sərfəli reasoning, dəqiq promptlara cavab. | "Səmərəli menecer" – satış/həcmi yüksək sorğular.citeturn0search0turn2search5 |
| `gpt-5-nano` | Ultra aşağı gecikməli təsnifat və marşrutlaşdırma. | "Router operatoru" – niyyət/trigger aşkarlanması.citeturn0search1turn1search6 |
| `gpt-5.1-codex` | Agentik kod generasiyası və kod revizyonu (Codex mühitləri). | "Sintetik baş mühəndis" – tam güclü kod redaktoru.citeturn0search5turn1search6 |
| `gpt-5.1-codex-mini` | Ucuz kod agenti, GPT-5.1 Codex-in mini versiyası. | "Junior kod mütəxəssisi" – inline kod fikirləri.citeturn0search5turn0search6 |
| `gpt-5-pro` | Maksimum reasoning, yüksək latency, yalnız `reasoning.effort: high`. | "Ekspert məsləhətçi" – dərin qərar dəstəyi.citeturn1search0turn1search7 |

## 2. GPT-4.1 və Multimodal GPT-4o ailəsi

| Model | Əsas istifadə məqsədi | Effektiv təyinat |
| --- | --- | --- |
| `gpt-4.1` | 1M kontekstli, reasoning addımı olmadan ağıllı dialoq və alət çağırışı. | Əsas dialoq orkestratoru (GPT-5 mövcud deyilsə).citeturn2search3 |
| `gpt-4.1-mini` | Qənaətcil, uzun kontekstli dəstək dialoqları. | Empatik dəstək agenti.citeturn2search0 |
| `gpt-4o` | Mətn + şəkil girişləri, yüksək keyfiyyətli multimodal cavablar. | Texniki diaqnostika, OCR, multimodal sintez.citeturn3search5 |
| `gpt-4o-mini` | Sürətli satış cavabları, niyyət təsnifatı. | İqtisadi satış agenti / router.citeturn1search1 |
| `whisper-1` | Səsli mesajların stabil STT-si. | WhatsApp gateway PTT transkripsiya boru xətti üçün tövsiyə olunan baza model. |
| `gpt-4o-transcribe` | Premium STT, daha yüksək dəqiqlik. | Uzun audio, çoxdilli transkriptlər.citeturn3search1 |
| `gpt-4o-transcribe-diarize` | Spiker ayırması ilə transkript. | Mehriban məhkəmə/çağrı mərkəzi qeydləri.citeturn3search1 |
| `gpt-4o-mini-tts` | Mətn → səs cavabları. | WhatsApp audio cavab generatoru.citeturn3search1 |

## 3. Reasoning və Araşdırma modelləri (o-seriyası)

| Model | Əsas istifadə məqsədi | Effektiv təyinat |
| --- | --- | --- |
| `o3`, `o3-pro` | Dərin araşdırma, strateji planlaşdırma, yüksək compute. | Dərin bütövləşdirilmiş araşdırma boru xətti.citeturn0search0turn1search0 |
| `o3-deep-research` | Avtopilot tərzdə uzunmüddətli araşdırma. | Muxtar araşdırma agentləri.citeturn0search0turn2search2 |
| `o4-mini` / `o4-mini-deep-research` | Daha sərfəli reasoning, STEM / kod tapşırıqları. | Sürətli decision support və kod yoxlaması.citeturn2search6turn2search2 |

## 4. Realtime, Audio və Vizual modellər

| Model | Əsas istifadə məqsədi | Effektiv təyinat |
| --- | --- | --- |
| `gpt-realtime`, `gpt-realtime-mini` | Realtime səs-mətn dialoqları (WebRTC/WebSocket). | Canlı operator / avto-call mərkəzi.citeturn3search0turn3search1 |
| `gpt-audio`, `gpt-audio-mini` | Audio giriş/çıxışlı chat tamamlamaları. | Səsli kontent sintezi, podcast avtomatizasiyası.citeturn3search1 |
| `gpt-image-1`, `gpt-image-1-mini` | Marketinq vizualları, UI prototipləri. | Kreativ kontent generatoru.citeturn3search1turn3search5 |
| `sora-2`, `sora-2-pro` | Video generasiyası (sinxron audio ilə). | Promolar, storyboard prototipləri.citeturn3search1 |
| `computer-use-preview` | GUI avtomatlaşdırması, arxa office RPA. | Remote UI agentləri.citeturn2search2 |
| `gpt-5-search-api`, `gpt-4o-search-preview` | Web / fakt axtarışı. | Canlı məlumat gətirmə (stok, qiymət).citeturn2search2 |

## 5. Açıq Çəki (Open-weight) modellər

| Model | Əsas istifadə məqsədi | Effektiv təyinat |
| --- | --- | --- |
| `gpt-oss-120b` | H100 ölçekli, tam açıq lisenziyalı model. | On-prem agent laboratoriyası.citeturn3search4 |
| `gpt-oss-20b` | Orta ölçülü, aşağı gecikməli açıq model. | Lokallaşdırılmış / xüsusi domen agentləri.citeturn3search4 |

## 6. Router memarlığı üzrə tövsiyələr

1. **İlkin təsnifat:** Default olaraq `gpt-4o-mini` router rolunu oynayır; tenant səviyyəsində mövcuddursa `gpt-5-nano` ilə gecikməni daha da azalda bilərsiniz.citeturn1search1
2. **Orkestrator:** Kompleks dialoqlar üçün `gpt-4o` (və ya tenantda aktiv olan `gpt-5.*`).citeturn2search3
3. **Multimodal / diaqnostika:** Şəkil, OCR, texniki analiz üçün `gpt-4o`; ehtiyatda `gpt-4o` mövcud deyilsə `gpt-5` modeli də şəkil girişini dəstəkləyir.citeturn3search5turn0search3
4. **Audio boru xətti:** Standart olaraq `whisper-1`, daha dəqiq nəticə üçün `gpt-4o-transcribe` və ya diarize varianta keçid.citeturn3search1
5. **Kod alətləri:** Kod-centric iş axınları üçün `gpt-5.1-codex` və ya `gpt-5.1-codex-mini`; WA agentində `reasoning.effort` parametrini testi mühitində tənzimlə.citeturn1search6turn0search6
6. **Realtime:** Səsli çağırış boru xətti üçün `gpt-realtime` (və ya mini) ilə WebRTC adapterini yenilə.citeturn3search0

## 7. Env dəyişənləri üçün yenilənmiş tövsiyələr

| Env dəyişəni | Tövsiyə olunan dəyər | Şərh |
| --- | --- | --- |
| `OPENAI_MODEL` | `gpt-4o-mini` *(default)*; ehtiyac olarsa `gpt-4o`. | Agent orkestratoru. |
| `AGENT_MODEL_GENERAL` | `gpt-4o-mini`. | Ümumi dialoq. |
| `AGENT_MODEL_SALES` | `gpt-4o`. | Sürətli satış təklifləri. |
| `AGENT_MODEL_SUPPORT` | `gpt-4o-mini`. | Empatik dəstək cavabları. |
| `AGENT_MODEL_DIAGNOSTICS` | `gpt-4o`. | Multimodal diaqnostika. |
| `OPENAI_VISION_MODEL` | `gpt-4o`. | Şəkil və OCR konteksti.citeturn3search5 |
| `OPENAI_TRANSCRIPTION_MODEL` | `whisper-1`. | Səsli mesajların STT-si. |
| `OPENAI_TTS_MODEL` | `tts-1`. | Mətn → səs cavabları. |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small`. | Məhsul axtarışı / RAG.citeturn2search2 |

## 8. İnteqrasiya Qeydləri

- **Tenant yoxlaması:** Bəzi modellər (məsələn `gpt-5-pro`, `gpt-5.1-codex`) tədricən buraxılır; həmişə `v1/models` siyahısı ilə təsdiq edin.
- **Latency idarəsi:** `gpt-5-pro` sorğuları dəqiqələr çəkə bilər, ona görə Responses API-də background moda keçin.citeturn1search0
- **Qiymət nəzarəti:** Token qiymətlərini OpenAI pricing səhifəsi ilə izləyin; böyük fərqlər (`$15`/1M input üçün `gpt-5-pro`) planlama zamanı nəzərə alınmalıdır.citeturn2search2
- **Fallback dizaynı:** Hər iş axını üçün azı iki model (birincil + ehtiyat) təyin edin; məsələn STT boru xəttində `whisper-1` → `gpt-4o-transcribe`.
- **Sənədləşmə sinxronu:** `docs/openai.md` faylındakı API nümunələri və env şablonları bu cədvələ uyğun saxlanılmalıdır.

Bu konstellasiya cədvəli WhatsApp gateway agentini konfiqurasiya edərkən və yeni iş axınları dizayn edərkən istinad kimi istifadə olunmalıdır. Yeni model ailəsi əlavə olunduqda (məsələn, Sora, Realtime yeniləmələri) burada müvafiq bölmə açın və env tövsiyələrini yeniləyin.
