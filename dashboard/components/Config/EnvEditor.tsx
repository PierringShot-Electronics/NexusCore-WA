import { useEffect, useMemo, useState } from 'react';

export interface EnvVariableEntry {
  key: string;
  label: string;
  description?: string;
  secret?: boolean;
  value: string;
}

interface EnvEditorProps {
  entries: EnvVariableEntry[];
  path: string;
  updatedAt: string | null;
  onSave: (changes: Array<{ key: string; value: string }>) => Promise<void>;
}

interface FormStatus {
  type: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

export function EnvEditor({ entries, path, updatedAt, onSave }: EnvEditorProps) {
  const [draftEntries, setDraftEntries] = useState(() => cloneEntries(entries));
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  useEffect(() => {
    setDraftEntries(cloneEntries(entries));
    setStatus({ type: 'idle' });
  }, [entries]);

  const originalMap = useMemo(() => new Map(entries.map((entry) => [entry.key, entry.value])), [entries]);

  const changes = useMemo(
    () =>
      draftEntries
        .filter((entry) => entry.value !== (originalMap.get(entry.key) ?? ''))
        .map((entry) => ({ key: entry.key, value: entry.value })),
    [draftEntries, originalMap]
  );

  const dirty = changes.length > 0;

  async function handleSave() {
    if (!dirty) return;
    setStatus({ type: 'saving' });
    try {
      await onSave(changes);
      setStatus({ type: 'success', message: 'Ətraf mühit dəyişənləri yeniləndi.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Dəyişikliklər saxlanmadı'
      });
    }
  }

  function handleReset() {
    setDraftEntries(cloneEntries(entries));
    setStatus({ type: 'idle' });
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
        🔁 Env dəyişiklikləri tam qüvvəyə minməsi üçün backend servisinin yenidən başladılmasına ehtiyac ola bilər.
      </p>
      <div className="space-y-3">
        {draftEntries.map((entry) => {
          const isDirty = entry.value !== (originalMap.get(entry.key) ?? '');
          const isSecretVisible = visibleSecrets.has(entry.key);
          return (
            <div
              key={entry.key}
              className={`rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition ${
                isDirty ? 'border-emerald-400/50 shadow-[0_10px_40px_-25px_rgba(16,185,129,0.75)]' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{entry.label}</span>
                    {entry.secret ? (
                      <span className="rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">
                        Gizli
                      </span>
                    ) : null}
                    {isDirty ? (
                      <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                        Dəyişdi
                      </span>
                    ) : null}
                  </div>
                  {entry.description ? (
                    <p className="text-xs text-slate-500">{entry.description}</p>
                  ) : null}
                </div>
                <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-400">{entry.key}</code>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type={entry.secret && !isSecretVisible ? 'password' : 'text'}
                  value={entry.value}
                  onChange={(event) =>
                    setDraftEntries((prev) =>
                      prev.map((draftEntry) =>
                        draftEntry.key === entry.key ? { ...draftEntry, value: event.target.value } : draftEntry
                      )
                    )
                  }
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  spellCheck={false}
                />
                {entry.secret ? (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleSecrets((prev) => {
                        const next = new Set(prev);
                        if (next.has(entry.key)) {
                          next.delete(entry.key);
                        } else {
                          next.add(entry.key);
                        }
                        return next;
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-400 hover:text-emerald-200"
                  >
                    {isSecretVisible ? 'Gizlət' : 'Göstər'}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!dirty || status.type === 'saving'}
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.type === 'saving' ? 'Yadda saxlanılır…' : 'Env dəyişikliklərini saxla'}
        </button>
        <button
          type="button"
          disabled={!dirty || status.type === 'saving'}
          onClick={handleReset}
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

function cloneEntries(entries: EnvVariableEntry[]): EnvVariableEntry[] {
  return entries.map((entry) => ({ ...entry }));
}

function StatusPill({ status }: { status: FormStatus }) {
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
