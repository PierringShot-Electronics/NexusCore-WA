# OpenAI Integration Cookbook

Bu sənəd NexusCore-WA layihəsində OpenAI API-lərindən istifadə üçün
sürətli başlanğıc və praktiki nümunələri toplu halda saxlayır. Backend
servisi hazırda rəsmi `openai` SDK-sından (Node.js) istifadə edir, həmq
göstərilən cURL nümunələri ilə xam sorğuları sınaqdan keçirmək mümkündür.

> **Vacib:** API açarlarını _heç vaxt_ repoya commit etməyin. Açarları
> yalnız lokal `.env` faylınızda saxlayın və UI-dən (Dashboard → Env
> Konfiqurasiya) idarə edə bilərsiniz.

## 1. Ətraf mühitin hazırlanması

### 1.1. API açarı yarat və ixrac et

- [OpenAI API Dashboard](https://platform.openai.com/api-keys) üzərinə
  daxil olub yeni açar yaradın.
- macOS/Linux üçün terminalda:

  ```bash
  export OPENAI_API_KEY="sk-..."
  ```

- Windows PowerShell:

  ```powershell
  setx OPENAI_API_KEY "sk-..."
  ```

`OPENAI_API_KEY` ətraf mühitdə saxlanılan kimi server tərəfdə
`process.env.OPENAI_API_KEY` ilə oxunur.

### 1.2. `.env` konfiqurasiyası (backend)

`backend/.env.example` faylını əsas götürüb aşağıdakı açarları
qəpiklə:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_VISION_MODEL=gpt-4o-mini
OPENAI_TRANSCRIPTION_MODEL=whisper-large-v3-turbo
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

> Dashboard → Env Konfiqurasiya bölməsi bu dəyişənləri UI üzərindən
> redaktə etməyə imkan verir.

## 2. SDK-lardan istifadə

### 2.1. Node.js (backend default)

```bash
npm install openai
```

```ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askModel(prompt: string) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    input: prompt
  });

  return response.output_text;
}
```

### 2.2. Python

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-4o-mini",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(resp.output_text)
```

## 3. Əsas istifadə nümunələri

### 3.1. Mətn generasiyası (Responses API)

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "input": "Summarize the NexusCore-WA architecture in 3 bullet points."
  }'
```

### 3.2. Multimodal görüntü analizi

Backend-də `analyzeImage` funksiyası aşağıdakı strukturu gözləyir:

```ts
const response = await client.responses.create({
  model: process.env.OPENAI_VISION_MODEL ?? 'gpt-4o-mini',
  input: [
    {
      role: 'user',
      content: [
        { type: 'input_text', text: 'Bu şəkildən mümkün qədər çox məlumat çıxart' },
        { type: 'input_image', image_url: 'https://...' }
      ]
    }
  ]
});
```

CURL ekvivalenti:

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "input": [{
      "role": "user",
      "content": [
        { "type": "input_text", "text": "What is shown here?" },
        { "type": "input_image", "image_url": "https://example.com/photo.jpg" }
      ]
    }]
  }'
```

### 3.3. Audio transkripsiyası

Backend `processMediaMessages` səs faylını `audio.transcriptions.create`
ilə emal edir. Lokal test üçün:

```bash
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F model=whisper-large-v3-turbo \
  -F file=@voice-note.ogg
```

Node nümunəsi:

```ts
const file = await toFile(buffer, 'note.ogg', { type: 'audio/ogg' });
const transcript = await client.audio.transcriptions.create({
  file,
  model: process.env.OPENAI_TRANSCRIPTION_MODEL ?? 'whisper-large-v3-turbo',
  response_format: 'verbose_json'
});
```

### 3.4. Embeddinglər (stok axtarışı üçün)

```ts
const emb = await client.embeddings.create({
  model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
  input: 'Asus X570 ekran'
});

const vector = emb.data[0].embedding; // pgvector <-> istifadə olunur
```

## 4. Konfiqurasiya parametrləri (env + agent config)

| Açar | Təsvir | Default |
| ---- | ------ | ------- |
| `OPENAI_MODEL` | Mətn cavab modeli | `gpt-4o-mini` |
| `OPENAI_VISION_MODEL` | Şəkil analiz modeli | `gpt-4o-mini` |
| `OPENAI_TRANSCRIPTION_MODEL` | Audio transkripsiyası | `whisper-large-v3-turbo` |
| `OPENAI_EMBEDDING_MODEL` | Vektor embedding | `text-embedding-3-small` |

Agent UI-də (`data/agent-config.json`) heuristikaları müxtəlif regex
listləri ilə dəyişmək mümkündür; backend defaultları schema-da
görüldüyü kimi JSON obyektlərini tələb edir (məsələn,
`heuristics.productPatterns`).

## 5. Faydalı istinadlar

- OpenAI Quickstart: <https://platform.openai.com/docs/quickstart>
- API Reference (Responses): <https://platform.openai.com/docs/api-reference/responses>
- Streaming: <https://platform.openai.com/docs/guides/streaming-responses>
- Vision Guide: <https://platform.openai.com/docs/guides/images>
- Whisper Transcription: <https://platform.openai.com/docs/guides/speech-to-text>

## 6. Troubleşuting

- **“Invalid API key”**: Dashboard → Env Konfiqurasiya bölməsində
  açarın düzgün daxil edildiyini və konteynerin yenidən başladıldığını
  yoxlayın.
- **`ENOENT` qovluq xətası**: SDK-nı lokal sınaqda işlədirsinizsə,
  fayl yollarını (`fs.createReadStream`) dəqiq göstərin.
- **Quota limitləri**: OpenAI hesabınızda billing bölməsində əlavə kredit
  tələb oluna bilər.

Bu cookbook sənədi layihədə tez-tez istifadə olunan nümunələri tək
yerdə saxlayır; əlavə ssenari olduqda bura əlavə et.
