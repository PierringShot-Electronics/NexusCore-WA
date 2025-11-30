import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

interface PromptEditorProps {
  content: string;
  path: string;
  updatedAt: string | null;
  onSave: (nextContent: string) => Promise<void>;
}

export function PromptEditor({ content, path, updatedAt, onSave }: PromptEditorProps) {
  const [draft, setDraft] = useState(content);
  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'success' | 'error'; message?: string }>({
    type: 'idle'
  });

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const dirty = useMemo(() => draft !== content, [draft, content]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dirty) return;
    setStatus({ type: 'saving' });
    try {
      await onSave(draft);
      setStatus({ type: 'success', message: 'Biznes promptu yeniləndi.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: (error instanceof Error ? error.message : 'Yeniləmə mümkün olmadı') ?? undefined
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="businessPrompt" className="text-sm font-medium text-slate-200">
          Əsas prompt mətn
        </label>
        <textarea
          id="businessPrompt"
          className="min-h-[240px] w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
        />
        <p className="text-xs text-slate-500">
          Fayl: <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-300">{path}</code>{' '}
          {updatedAt ? `• Son yenilənmə: ${formatDate(updatedAt)}` : null}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!dirty || status.type === 'saving'}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.type === 'saving' ? 'Yazılır…' : 'Promptu yadda saxla'}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(content);
            setStatus({ type: 'idle' });
          }}
          disabled={!dirty || status.type === 'saving'}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sıfırla
        </button>
        <StatusBadge status={status} />
      </div>
    </form>
  );
}

function StatusBadge({
  status
}: {
  status: { type: 'idle' | 'saving' | 'success' | 'error'; message?: string };
}) {
  if (status.type === 'idle') return null;
  if (status.type === 'saving') {
    return <span className="text-sm text-emerald-200/70">Dəyişikliklər saxlanılır…</span>;
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
