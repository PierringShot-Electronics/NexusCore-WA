import Head from 'next/head';
import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:3000';

type StatusResponse = {
  backend: { status: string; time: string };
  waha: {
    name: string;
    status: string;
    engine?: { engine: string; state: string };
    me?: { id: string; pushName?: string };
  } | null;
};

type LogEntry = {
  id: string;
  level: string;
  message: string;
  time: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const QR_ERROR_MESSAGES: Record<string, string> = {
  session_already_authenticated: 'Sessiya aktivdir, QR tələb olunmur.',
  session_not_ready: 'WAHA sessiyası QR üçün hazırlaşır, bir neçə saniyə sonra yenidən yoxlayın.',
  session_start_failed: 'Sessiyanı işə salmaq mümkün olmadı. WAHA loglarına baxın.',
  status_unavailable: 'WAHA statusu əldə olunmadı. WAHA konteynerini yoxlayın.',
  qr_not_available: 'QR hələ generasiya olunmayıb. Bir qədər sonra yenidən yoxlayın.'
};

function formatQrError(code: string): string {
  return QR_ERROR_MESSAGES[code] ?? `QR hazır deyil: ${code}`;
}

export default function Home() {
  const { data, error } = useSWR<StatusResponse>('/api/status', fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: false
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [qr, setQr] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isFetchingQr, setIsFetchingQr] = useState(false);

  const wahaStatus = data?.waha?.status ?? 'UNKNOWN';
  const sessionActive = wahaStatus === 'CONNECTED' || wahaStatus === 'WORKING';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const source = new EventSource(`${apiBase}/admin/logs/stream`);
    source.onmessage = (event) => {
      try {
        const entry = JSON.parse(event.data) as LogEntry;
        setLogs((prev) => [entry, ...prev].slice(0, 200));
      } catch (parseError) {
        console.error('Failed to parse log entry', parseError);
      }
    };
    source.onerror = () => {
      source.close();
    };
    return () => {
      source.close();
    };
  }, []);

  useEffect(() => {
    if (!sessionActive) {
      fetch(`${apiBase}/admin/qr`)
        .then((res) => res.json())
        .then((qrData) => {
          if (qrData?.qr) {
            setQr(qrData.qr);
            setQrError(null);
          } else if (qrData?.error) {
            setQr(null);
            setQrError(qrData.error);
          }
        })
        .catch((err) => {
          setQr(null);
          setQrError(err.message);
        });
    } else {
      setQr(null);
      setQrError(null);
    }
  }, [sessionActive]);

  const wahaStatusLabel = useMemo(() => {
    if (!data?.waha) return 'Disconnected';
    const status = data.waha.status;
    if (status === 'CONNECTED' || status === 'WORKING') {
      return 'Connected';
    }
    if (status === 'SCAN_QR_CODE') {
      return 'Awaiting QR scan';
    }
    return status || 'Unknown';
  }, [data?.waha]);

  return (
    <>
      <Head>
        <title>NexusCore-WA Dashboard</title>
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
          <header>
            <h1 className="text-3xl font-semibold">NexusCore-WA Control Tower</h1>
            <p className="mt-2 text-sm text-slate-300">
              WAHA sessiya statusu, canlı loglar və manual handover əməliyyatları üçün
              operator paneli.
            </p>
          </header>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl lg:col-span-2">
              <h2 className="text-xl font-medium">Platform Status</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <StatusCard
                  title="Backend"
                  status="OK"
                  subtitle={new Date(data?.backend?.time ?? Date.now()).toLocaleString()}
                />
                <StatusCard
                  title="WAHA Session"
                  status={wahaStatusLabel}
                  subtitle={data?.waha?.me?.pushName ?? data?.waha?.me?.id ?? '—'}
                  tone={
                    wahaStatusLabel === 'Connected'
                      ? 'success'
                      : wahaStatusLabel === 'Awaiting QR scan'
                        ? 'warning'
                        : 'error'
                  }
                />
              </div>
              {error && (
                <p className="mt-4 rounded bg-rose-500/10 p-3 text-sm text-rose-200">
                  Status məlumatı çəkilə bilmədi: {String(error)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h2 className="text-xl font-medium">WAHA QR / Session</h2>
              {qr ? (
                <img
                  src={`data:image/png;base64,${qr}`}
                  alt="WAHA QR"
                  className="mt-4 w-full rounded-lg border border-slate-800 bg-white p-3"
                />
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-300">
                  {qrError
                    ? formatQrError(qrError)
                    : 'Sessiya hazırdır. QR yalnız yenidən qoşulma lazım olanda göstəriləcək.'}
                </div>
              )}
              <button
                type="button"
                disabled={sessionActive || isFetchingQr}
                onClick={() => {
                  if (sessionActive) {
                    setQr(null);
                    setQrError('session_already_authenticated');
                    return;
                  }
                  setIsFetchingQr(true);
                  fetch(`${apiBase}/admin/qr`)
                    .then((res) => res.json())
                    .then((qrData) => {
                      if (qrData?.qr) {
                        setQr(qrData.qr);
                        setQrError(null);
                      } else if (qrData?.error) {
                        setQr(null);
                        setQrError(qrData.error);
                      }
                    })
                    .catch((err) => {
                      setQr(null);
                      setQrError(err.message);
                    })
                    .finally(() => {
                      setIsFetchingQr(false);
                    });
                }}
                className="mt-4 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingQr ? 'QR alınır...' : 'QR kodunu yenilə'}
              </button>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl lg:col-span-2">
              <h2 className="text-xl font-medium">Live Logs</h2>
              <div className="mt-4 h-80 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs">
                {logs.length === 0 ? (
                  <p className="text-slate-500">Log axını gözlənilir…</p>
                ) : (
                  <ul className="space-y-2">
                    {logs.map((log) => (
                      <li key={log.id} className="rounded bg-slate-900/70 p-2">
                        <span className="text-slate-500">
                          {new Date(log.time).toLocaleTimeString()}
                        </span>{' '}
                        <span
                          className={
                            log.level === 'error'
                              ? 'text-rose-300'
                              : log.level === 'warn'
                              ? 'text-amber-300'
                              : 'text-emerald-300'
                          }
                        >
                          [{log.level.toUpperCase()}]
                        </span>{' '}
                        <span>{log.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <ManualHandover />
          </section>
        </div>
      </main>
    </>
  );
}

function StatusCard({
  title,
  status,
  subtitle,
  tone = 'success'
}: {
  title: string;
  status: string;
  subtitle?: string;
  tone?: 'success' | 'warning' | 'error';
}) {
  const toneClasses =
    tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
      : tone === 'warning'
        ? 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30'
        : 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30';

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{title}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses}`}>
          {status}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{subtitle ?? '—'}</p>
    </article>
  );
}

function ManualHandover() {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-xl font-medium">Manual Handover</h2>
      <p className="mt-2 text-sm text-slate-300">
        Müştəri söhbətini insan operatoruna yönləndirmək üçün WhatsApp nömrəsini daxil
        edin.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(null);
          fetch(`${apiBase}/admin/handover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId })
          })
            .then((res) => res.json())
            .then((response) => {
              setMessage(
                response?.status === 'accepted'
                  ? 'Söhbət insan operatoruna yönləndirildi.'
                  : `Mümkün olmadı: ${response?.error ?? 'Naməlum səbəb'}`
              );
            })
            .catch((err) => setMessage(`Səhv: ${err.message}`));
        }}
      >
        <input
          value={chatId}
          onChange={(event) => setChatId(event.target.value)}
          placeholder="99455XXXXXXX@c.us"
          className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-md border border-emerald-500 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
        >
          Handover et
        </button>
      </form>
      {message && <p className="mt-3 text-xs text-slate-300">{message}</p>}
    </div>
  );
}
