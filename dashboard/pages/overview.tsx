import Head from 'next/head';
import useSWR from 'swr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { SectionCard } from '../components/Common/SectionCard';
import { AppLayout } from '../components/Layout/AppLayout';
import type { NextPageWithLayout } from './_app';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:3000';

type StatusResponse = {
  backend: { status: string; time: string };
  whatsappGateway: {
    name: string;
    status: string;
    engine?: { engine: string; state: string };
    me?: { id: string; pushName?: string };
  } | null;
};

type AdminConfigResponse = {
  agent: {
    settings: {
      logs: {
        historyLimit: number;
      };
    };
  };
};

type LogEntry = {
  id: string;
  level: string;
  message: string;
  time: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

const QR_ERROR_MESSAGES: Record<string, string> = {
  session_already_authenticated: 'Sessiya aktivdir, QR tələb olunmur.',
  session_not_ready:
    'WhatsApp gateway sessiyası QR üçün hazırlaşır, bir neçə saniyə sonra yenidən yoxlayın.',
  session_start_failed:
    'Sessiyanı işə salmaq mümkün olmadı. Gateway loqlarını yoxlayın.',
  status_unavailable: 'Gateway statusu əldə olunmadı. WhatsApp gateway konteynerini yoxlayın.',
  qr_not_available: 'QR hələ generasiya olunmayıb. Bir qədər sonra yenidən yoxlayın.'
};

const OverviewPage: NextPageWithLayout = () => {
  const { data: statusData, error: statusError } = useSWR<StatusResponse>('/api/status', fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: false
  });
  const { data: configData } = useSWR<AdminConfigResponse>('/api/config', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [qr, setQr] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isFetchingQr, setIsFetchingQr] = useState(false);

  const gatewayStatus = statusData?.whatsappGateway?.status ?? 'UNKNOWN';
  const sessionActive = gatewayStatus === 'CONNECTED' || gatewayStatus === 'WORKING';

  const historyLimit = configData?.agent.settings.logs.historyLimit ?? 200;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const source = new EventSource(`${apiBase}/admin/logs/stream`);
    source.onmessage = (event) => {
      try {
        const entry = JSON.parse(event.data) as LogEntry;
        setLogs((previous) => [entry, ...previous].slice(0, historyLimit));
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
  }, [historyLimit]);

  useEffect(() => {
    setLogs((previous) => previous.slice(0, historyLimit));
  }, [historyLimit]);

  const requestQr = useCallback(async () => {
    if (sessionActive) {
      setQr(null);
      setQrError('session_already_authenticated');
      return;
    }

    setIsFetchingQr(true);
    try {
      const response = await fetch(`${apiBase}/admin/qr`);
      const payload = await response.json();
      if (payload?.qr) {
        setQr(payload.qr);
        setQrError(null);
      } else if (payload?.error) {
        setQr(null);
        setQrError(payload.error);
      }
    } catch (error) {
      setQr(null);
      setQrError(error instanceof Error ? error.message : 'QR alınmadı');
    } finally {
      setIsFetchingQr(false);
    }
  }, [sessionActive]);

  useEffect(() => {
    if (!sessionActive) {
      void requestQr();
    } else {
      setQr(null);
      setQrError(null);
    }
  }, [sessionActive, requestQr]);

  const gatewayStatusLabel = useMemo(() => {
    if (!statusData?.whatsappGateway) return 'Disconnected';
    const status = statusData.whatsappGateway.status;
    if (status === 'CONNECTED' || status === 'WORKING') {
      return 'Connected';
    }
    if (status === 'SCAN_QR_CODE') {
      return 'Awaiting QR scan';
    }
    return status || 'Unknown';
  }, [statusData?.whatsappGateway]);

  return (
    <>
      <Head>
        <title>NexusCore · Realtime Panel</title>
      </Head>
      <OverviewSection
        status={statusData}
        statusError={statusError as Error | undefined}
        statusLabel={gatewayStatusLabel}
        logs={logs}
        qr={qr}
        qrError={qrError}
        onRefreshQr={requestQr}
        sessionActive={sessionActive}
        isFetchingQr={isFetchingQr}
        historyLimit={historyLimit}
      />
    </>
  );
};

function OverviewSection({
  status,
  statusError,
  statusLabel,
  logs,
  qr,
  qrError,
  onRefreshQr,
  sessionActive,
  isFetchingQr,
  historyLimit
}: {
  status: StatusResponse | undefined;
  statusError: Error | undefined;
  statusLabel: string;
  logs: LogEntry[];
  qr: string | null;
  qrError: string | null;
  onRefreshQr: () => void;
  sessionActive: boolean;
  isFetchingQr: boolean;
  historyLimit: number;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-6">
        <SectionCard
          title="Platforma Statusu"
          description="Backend, WhatsApp gateway sessiyası və mərkəzi komponentlərin canlı monitorinqi."
          actions={null}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <StatusCard
              title="Backend"
              status="OK"
              subtitle={new Date(status?.backend?.time ?? Date.now()).toLocaleString()}
              tone="success"
            />
            <StatusCard
              title="WhatsApp Gateway"
              status={statusLabel}
              subtitle={
                status?.whatsappGateway?.me?.pushName ?? status?.whatsappGateway?.me?.id ?? '—'
              }
              tone={
                statusLabel === 'Connected'
                  ? 'success'
                  : statusLabel === 'Awaiting QR scan'
                    ? 'warning'
                    : 'error'
              }
            />
          </div>
          {statusError ? (
            <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              Status məlumatı çəkilə bilmədi: {statusError.message}
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Canlı Log Axını"
          description={`Son ${historyLimit} agent hadisəsi. Dəyişiklik yeni limitlə yenilənəcək.`}
        >
          <div className="h-80 overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950/80">
            <div className="h-full overflow-y-auto px-4 py-3 text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-500">Log axını gözlənilir…</p>
              ) : (
                <ul className="space-y-2">
                  {logs.map((log) => (
                    <li
                      key={log.id}
                      className="rounded-lg border border-slate-800/80 bg-slate-900/80 px-3 py-2 shadow-inner"
                    >
                      <span className="text-slate-500">{new Date(log.time).toLocaleTimeString()}</span>{' '}
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
        </SectionCard>
      </div>

      <div className="flex flex-col gap-6">
        <SectionCard
          title="WhatsApp Sessiya İdarəetməsi"
          description="QR kodu yeniləyin və ya mövcud sessiya haqqında məlumat alın."
        >
          {qr ? (
            <img
              src={`data:image/png;base64,${qr}`}
              alt="WhatsApp QR"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-white p-4 shadow-lg"
            />
          ) : (
            <div className="mt-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-6 text-sm text-slate-300">
              {qrError ? formatQrError(qrError) : 'Sessiya aktivdir. QR yalnız yenidən qoşulma tələb olunanda göstərilir.'}
            </div>
          )}
          <button
            type="button"
            onClick={onRefreshQr}
            disabled={sessionActive || isFetchingQr}
            className="mt-4 w-full rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingQr ? 'QR alınır…' : 'QR kodunu yenilə'}
          </button>
        </SectionCard>

        <SectionCard
          title="Manual Handover"
          description="Kritik dialoqu insan operatoruna yönləndirin."
        >
          <ManualHandover />
        </SectionCard>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  status,
  subtitle,
  tone
}: {
  title: string;
  status: string;
  subtitle?: string;
  tone: 'success' | 'warning' | 'error';
}) {
  const toneClasses =
    tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/40'
      : tone === 'warning'
        ? 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/40'
        : 'bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/40';

  return (
    <article className="rounded-xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-slate-100">{title}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses}`}>{status}</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">{subtitle ?? '—'}</p>
    </article>
  );
}

function ManualHandover() {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!chatId) {
      setMessage('WhatsApp chat ID daxil edin (məs: 99455XXXXXXX@c.us)');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase}/admin/handover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      });
      const payload = await response.json();
      setMessage(
        payload?.status === 'accepted'
          ? 'Söhbət insan operatoruna yönləndirildi.'
          : `Mümkün olmadı: ${payload?.error ?? 'Naməlum səbəb'}`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <input
        value={chatId}
        onChange={(event) => setChatId(event.target.value)}
        placeholder="99455XXXXXXX@c.us"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-emerald-500 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Handover göndərilir…' : 'Handover et'}
      </button>
      {message ? <p className="text-xs text-slate-300">{message}</p> : null}
    </form>
  );
}

OverviewPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout
      title="Ümumi Realtime Panel"
      description="Backend və WhatsApp gateway statusunu, canlı log axınını və son hadisələri izləyin."
    >
      {page}
    </AppLayout>
  );
};

function formatQrError(code: string): string {
  return QR_ERROR_MESSAGES[code] ?? `QR hazır deyil: ${code}`;
}

export default OverviewPage;
