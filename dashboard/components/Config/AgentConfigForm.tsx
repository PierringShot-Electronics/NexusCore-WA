import { useEffect, useMemo, useState } from 'react';

type HeuristicKey =
  | 'greetingPatterns'
  | 'manualHandoverKeywords'
  | 'productPatterns'
  | 'pricingPatterns'
  | 'competitorPatterns'
  | 'repairPatterns'
  | 'supportPatterns'
  | 'salesPatterns';

export interface AgentConfig {
  heuristics: Record<HeuristicKey, string[]>;
  vision: {
    maxImagesToProcess: number;
  };
  logs: {
    historyLimit: number;
  };
}

export interface AgentConfigUpdatePayload {
  heuristics?: Partial<Record<HeuristicKey, string[]>>;
  vision?: { maxImagesToProcess?: number };
  logs?: { historyLimit?: number };
}

interface AgentConfigFormProps {
  config: AgentConfig;
  path: string;
  updatedAt: string | null;
  onSave: (update: AgentConfigUpdatePayload) => Promise<void>;
}

interface FormStatus {
  type: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

const HEURISTIC_GROUPS: Array<{
  key: HeuristicKey;
  label: string;
  tooltip: string;
}> = [
  {
    key: 'greetingPatterns',
    label: 'Salamlaşma regexləri',
    tooltip: 'Regex ifadələri; istifadəçi salamı aşkar edildikdə agent hazır cavab göndərir.'
  },
  {
    key: 'manualHandoverKeywords',
    label: 'Operator tələbi açar sözləri',
    tooltip: 'Müştəri insan operatoru istədiyini bu ifadələrlə bildirəndə handover tetiklenir.'
  },
  {
    key: 'productPatterns',
    label: 'Məhsul sorğuları',
    tooltip: 'Stok məlumatı gətirmək üçün istifadə olunan açar sözlər və regexlər.'
  },
  {
    key: 'pricingPatterns',
    label: 'Qiymət sorğuları',
    tooltip: 'Dinamik qiymət təklifi hazırlamaq üçün tetik keywords.'
  },
  {
    key: 'competitorPatterns',
    label: 'Rəqib vurğuları',
    tooltip: 'Rəqib və bazar müqayisəsi üçün əlavə alətlər işə salınır.'
  },
  {
    key: 'repairPatterns',
    label: 'Təmir və servis ifadələri',
    tooltip: 'Foto/vision alətlərini də aktivləşdirən texniki servis siqnalları.'
  },
  {
    key: 'supportPatterns',
    label: 'Şikayət və dəstək',
    tooltip: 'Şikayət tonunu müəyyənləşdirib dəstək personasına yönləndirir.'
  },
  {
    key: 'salesPatterns',
    label: 'Satış niyyətləri',
    tooltip: 'Satış personasını və qiymət təklif modulunu aktiv edir.'
  }
];

export function AgentConfigForm({ config, path, updatedAt, onSave }: AgentConfigFormProps) {
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const [heuristicsDraft, setHeuristicsDraft] = useState<Record<HeuristicKey, string>>(() =>
    serializeHeuristics(config.heuristics)
  );
  const [visionDraft, setVisionDraft] = useState(String(config.vision.maxImagesToProcess));
  const [logDraft, setLogDraft] = useState(String(config.logs.historyLimit));

  useEffect(() => {
    setHeuristicsDraft(serializeHeuristics(config.heuristics));
    setVisionDraft(String(config.vision.maxImagesToProcess));
    setLogDraft(String(config.logs.historyLimit));
    setStatus({ type: 'idle' });
  }, [config]);

  const originalHeuristics = useMemo(() => serializeHeuristics(config.heuristics), [config.heuristics]);

  const dirty = useMemo(() => {
    const heuristicsChanged = HEURISTIC_GROUPS.some(
      ({ key }) => normalizeLines(heuristicsDraft[key]) !== normalizeLines(originalHeuristics[key])
    );
    const visionChanged = Number(visionDraft) !== config.vision.maxImagesToProcess;
    const logsChanged = Number(logDraft) !== config.logs.historyLimit;
    return heuristicsChanged || visionChanged || logsChanged;
  }, [config.logs.historyLimit, config.vision.maxImagesToProcess, heuristicsDraft, originalHeuristics, visionDraft, logDraft]);

  async function handleSave() {
    if (!dirty) return;
    setStatus({ type: 'saving' });
    try {
      const heuristicsUpdate: Partial<Record<HeuristicKey, string[]>> = {};
      HEURISTIC_GROUPS.forEach(({ key }) => {
        const normalized = normalizeLines(heuristicsDraft[key]);
        const original = normalizeLines(originalHeuristics[key]);
        if (arraysDifferent(normalized, original)) {
          heuristicsUpdate[key] = normalized;
        }
      });

      const visionValue = clamp(Number(visionDraft) || config.vision.maxImagesToProcess, 1, 10);
      const logValue = clamp(Number(logDraft) || config.logs.historyLimit, 50, 1000);

      const payload: AgentConfigUpdatePayload = {};
      if (Object.keys(heuristicsUpdate).length) {
        payload.heuristics = heuristicsUpdate;
      }
      if (visionValue !== config.vision.maxImagesToProcess) {
        payload.vision = { maxImagesToProcess: visionValue };
      }
      if (logValue !== config.logs.historyLimit) {
        payload.logs = { historyLimit: logValue };
      }

      if (!Object.keys(payload).length) {
        setStatus({ type: 'idle' });
        return;
      }

      await onSave(payload);
      setStatus({ type: 'success', message: 'Agent parametrləri yeniləndi.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Konfiqurasiya yenilənmədi'
      });
    }
  }

  function handleReset() {
    setHeuristicsDraft(originalHeuristics);
    setVisionDraft(String(config.vision.maxImagesToProcess));
    setLogDraft(String(config.logs.historyLimit));
    setStatus({ type: 'idle' });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {HEURISTIC_GROUPS.map(({ key, label, tooltip }) => (
          <label key={key} className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner">
            <span className="text-sm font-medium text-slate-200">{label}</span>
            <span className="text-xs text-slate-500">{tooltip}</span>
            <textarea
              value={heuristicsDraft[key]}
              onChange={(event) =>
                setHeuristicsDraft((prev) => ({
                  ...prev,
                  [key]: event.target.value
                }))
              }
              className="min-h-[120px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              spellCheck={false}
            />
            <span className="text-[11px] text-slate-500">Hər sətr bir regex və ya açar söz kimi qəbul edilir.</span>
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <span className="text-sm font-medium text-slate-200">Vision şəkil limiti</span>
          <p className="text-xs text-slate-500">Agent eyni sorğu üçün maksimum neçə şəkli OCR + analitikaya göndərir.</p>
          <input
            type="range"
            min={1}
            max={6}
            value={Number(visionDraft)}
            onChange={(event) => setVisionDraft(event.target.value)}
            className="mt-4 w-full accent-emerald-400"
          />
          <div className="mt-2 text-sm text-emerald-200">Hazırkı dəyər: {visionDraft}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <span className="text-sm font-medium text-slate-200">Log tarixçəsi limiti</span>
          <p className="text-xs text-slate-500">
            Canlı dashboard-da saxlanılan log mesajlarının maksimal sayı. Böyük dəyər performansa təsir edə bilər.
          </p>
          <input
            type="number"
            min={50}
            max={1000}
            step={10}
            value={logDraft}
            onChange={(event) => setLogDraft(event.target.value)}
            className="mt-4 w-32 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || status.type === 'saving'}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.type === 'saving' ? 'Yazılır…' : 'Parametrləri saxla'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!dirty || status.type === 'saving'}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sıfırla
        </button>
        <StatusPill status={status} />
        <span className="text-xs text-slate-500">
          Fayl: <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-300">{path}</code>{' '}
          {updatedAt ? `• Son yenilənmə: ${formatDate(updatedAt)}` : null}
        </span>
      </div>
    </div>
  );
}

function serializeHeuristics(heuristics: Record<HeuristicKey, string[]>): Record<HeuristicKey, string> {
  return Object.fromEntries(
    Object.entries(heuristics).map(([key, list]) => [key, list.join('\n')]) as Array<[HeuristicKey, string]>
  ) as Record<HeuristicKey, string>;
}

function normalizeLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arraysDifferent(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return true;
  return left.some((value, index) => value !== right[index]);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat('az-AZ', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function StatusPill({ status }: { status: FormStatus }) {
  if (status.type === 'idle') return null;
  if (status.type === 'saving') {
    return <span className="text-sm text-emerald-200/70">Yadda saxlanılır…</span>;
  }
  if (status.type === 'success') {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
        ✅ {status.message ?? 'Uğurlu saxlanıldı'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200">
      ⚠️ {status.message ?? 'Xəta baş verdi'}
    </span>
  );
}
