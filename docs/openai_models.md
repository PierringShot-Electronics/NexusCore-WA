# OpenAI Model Constellation Guide

_Updated: 01 December 2025_

Bu sənəd NexusCore-WA ekosistemində istifadə olunan, rəsmi olaraq dəstəklənən OpenAI model ailələrinin (model constellation) strateji xülasəsini təqdim edir. Məqsəd müxtəlif tapşırıqlar üçün ixtisaslaşmış modellərin birlikdə necə yönləndirilə biləcəyini sənədləşdirmək və router memarlığı ilə performans/xərc balansını təmin etməkdir.citeturn0search2turn1search3turn1search1

## 1. Yüksək Səviyyəli Cədvəl

| Model Ailəsi | Xüsusi İstifadə Məqsədi | Effektiv Olduğu Təyinat |
| --- | --- | --- |
| GPT-4.1 | Mürəkkəb təlimatların icrası, agent alət çağırışı, uzun kontekst. | "Orkestrator" – əsas dialoq beyni.citeturn0search2 |
| GPT-4.1 Mini | Xərcə həssas, uzun kontekstli dəstək dialoqları və rutin tapşırıqlar. | "Orta səviyyə məsləhətçi".citeturn1search7 |
| GPT-4o | Multimodal sorğular (mətn + şəkil), yüksək səviyyəli ümumi məqsədli cavablar. | "Flagship" multimodal analitik.citeturn1search3 |
| GPT-4o Mini | Sürətli/ucuz niyyət təsnifatı, satış cavabları, distillə olunmuş workflow-lar. | "Yüngül router & satış agenti".citeturn1search1 |
| GPT-4o Mini Transcribe | Səsli mesajların sürətli və dəqiq mətnə çevrilməsi. | "Səs konteks toplayıcısı".citeturn1search0 |
| GPT-4o Transcribe Diarize | Spiker ayırması ilə premium transkripsiya, çox spikerli danışıq. | "Məhkəmə katibi".citeturn1search6 |
| GPT-4o Mini TTS | Mətn → səs cavabları, WhatsApp audio cavabları, real-time readouts. | "Səs sintezçisi".citeturn1search5 |
| GPT-Realtime / Realtime Mini | Aşağı gecikməli səs agentləri, iki tərəfli audio dialoqları. | "Canlı operator".citeturn1search9turn0search0 |
| o3 / o3-Pro | Müəyyən olunmuş reasoning işləri, dərin araşdırma. | "Araşdırma mütəxəssisi".citeturn0search0 |
| o4-Mini | Sürətli və qənaətcil reasoning, kod və STEM tapşırıqları. | "Sürətli mühakimə".citeturn1search8 |
| GPT-Image-1 (& Mini) | UI/marketing vizualları, sürətli şəkil generasiyası. | "Vizual dizayner".citeturn0search0 |
| Omni-Moderation | Məzmun təhlükəsizliyi (mətn + görüntü). | "Təhlükəsizlik qatı".citeturn0search0 |

> **Qeyd:** Yuxarıdakı identifikatorlar OpenAI-nin 01 dekabr 2025 tarixinə rəsmi sənədləşməsində və qiymət cədvəllərində göstərilən mövcud modellərdir.

## 2. Strateji Prinsiplər

- **Router memarlığı:** Yüngül modellərlə (məsələn, `gpt-4o-mini`, `gpt-4.1-mini`) ilkin təsnifat aparıb ağır modellərə yönləndirmək xərci azaldır və gecikməni optimallaşdırır.citeturn1search1turn1search7
- **Agent fokuslu dizayn:** `gpt-4.1` alət çağırışı, 1M kontekst pəncərəsi və strukturlaşdırılmış çıxış dəstəyi ilə əsas orkestrator roluna uyğundur.citeturn0search2
- **Multimodal üstünlüklər:** `gpt-4o` ailəsi mətn + şəkil girişlərini dəstəklədiyi üçün WAHA şəkilləri və sənədlərini təhlil etmək üçün idealdır.citeturn1search3
- **Özəlləşdirmə (fine-tuning):** `gpt-4.1` və `gpt-4o` ailələri üçün rəsmi fine-tuning imkanları mövcuddur; satış və dəstək iş axınları domen spesifikləşdirilə bilər.citeturn0search0turn1search3

## 3. Tövsiyə Olunan İş Axını

1. **Sorğunu qəbul et:** WAHA-dan daxil olan mesaj (mətn, audio, şəkil, sənəd).
2. **İlkin təsnifat:** `gpt-4o-mini` və ya `gpt-4.1-mini` kimi yüngül modellər niyyəti, tonnu, sürətli triggerləri müəyyənləşdirir (stock, pricing, competitor, support və s.).citeturn1search1turn1search7
3. **Marşrutlaşdırma:**
   - Kompleks müştəri dialoqu → `gpt-4.1`.citeturn0search2
   - Sürətli satış cavabı → `gpt-4o-mini`.citeturn1search1
   - Texniki diaqnostika / multimodal → `gpt-4o`.citeturn1search3
   - Dərin araşdırma → `o3` / `o3-pro`.citeturn0search0
   - Kod yoxlaması və sürətli reasoning → `o4-mini`.citeturn1search8
4. **Alət inteqrasiyası:** Responses API vasitəsilə web search, file search, MCP alətləri və ya WAHA-specific integrasiyalar çağırılır.
5. **Handover & nəzarət:** Omni-Moderation nəticələri və ya insan operatora eskalasiyanı idarə edən qaydalar tətbiq olunur.

## 4. Env Dəyərləri üçün Model Təklifləri

| Ətraf Mühit Açarı | Tövsiyə olunan Model | Qısa izah |
| --- | --- | --- |
| `OPENAI_MODEL` | `gpt-4.1` | Əsas dialoq, alət çağırışı və uzun kontekst üçün baza model.citeturn0search2 |
| `AGENT_MODEL_GENERAL` | `gpt-4.1` | Persona-strategy modulunda default seçilmişdir. |
| `AGENT_MODEL_SALES` | `gpt-4o-mini` | Sürətli, qənaətcil satış cavabları.citeturn1search1 |
| `AGENT_MODEL_SUPPORT` | `gpt-4.1-mini` | Empatik, lakin xərc-effektiv dəstək cavabları.citeturn1search7 |
| `AGENT_MODEL_DIAGNOSTICS` | `gpt-4o` | Multimodal təhlil və texniki keşf üçün.citeturn1search3 |
| `OPENAI_VISION_MODEL` | `gpt-4o` | Şəkil/video mətnə çevirmə və diaqnostika.citeturn1search3 |
| `OPENAI_TRANSCRIPTION_MODEL` | `gpt-4o-mini-transcribe` | Səsli mesajların sürətli transkripsiyası.citeturn1search0 |
| `OPENAI_TTS_MODEL` | `gpt-4o-mini-tts` | WhatsApp səsli cavab layihələri.citeturn1search5 |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | Məhsul axtarışı / RAG pipeline.citeturn0search0 |
| `GROQ_ROUTER_MODEL` | `llama-3.1-8b-instant` | OpenAI əlçatan olmayanda niyyət təsnifatı fallback. |

## 5. Operativ Tövsiyələr

- **Latensini izləyin:** Router modelinin cavab müddəti yüksələrsə, `gpt-4o-mini` və ya `gpt-4.1-mini` arasında seçimi iş yükünə görə yenidən qiymətləndirin.citeturn1search1turn1search7
- **Fine-tuning strategiyası:** Domain spesifik dialoq üçün `gpt-4o` və `gpt-4o-mini` modellərinin rəsmi fine-tuning imkanlarından istifadə edin.citeturn0search0turn1search3
- **Moderasiya qatını unutmayın:** Omni-Moderation modeli API vasitəsilə paralel çağırılaraq riskli kontenti süzgəcdən keçirir.
- **Davamlı ölçümlər:** Agent heuristikalarının effektivliyini ölçmək üçün WAHA loglarını, transkriptləri və cavab keyfiyyətini (CSAT) dashboard-da izləyin.

## 6. Əlavə Materiallar

- `docs/openai.md`: API çağırış nümunələri, env parametrləri və curl testləri.
- `docs/openapi.json`: Backend Responses API inteqrasiyası üçün rəsmi OpenAPI sxemi.
- `docs/documentations.md`: Multimodal agent davranış qaydaları və WAHA orkestrasiyası.

> **Nəticə:** "Ən yaxşı" modeli seçmək kifayət deyil; müxtəlif ixtisaslı modelləri düzgün orkestrasiya etmək lazımdır. Router memarlığı ilə xərcləri optimallaşdırmaq, performansı artırmaq və multimodal davranışı sabit saxlamaq mümkündür. Bu sənəd həmin orkestrasiyanın təməl planıdır.
