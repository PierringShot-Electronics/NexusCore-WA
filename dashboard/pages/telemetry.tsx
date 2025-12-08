import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { SectionCard } from '../components/Common/SectionCard';
import { AppLayout } from '../components/Layout/AppLayout';
import type { NextPageWithLayout } from './_app';

type TelemetryStage = 'buffer' | 'intent' | 'persona' | 'tools' | 'response' | 'send';
type TelemetryStatus = 'success' | 'error';

type TelemetryEvent = {
  id: string;
  chatId: string;
  stage: TelemetryStage;
  status: TelemetryStatus;
  timestamp: string;
  durationMs?: number;
  persona?: string;
  model?: string;
  meta?: Record<string, unknown>;
};

type StageSnapshot = {
  status: 'idle' | TelemetryStatus;
  updatedAt: number | null;
  durationMs?: number;
  persona?: string;
  model?: string;
  meta?: Record<string, unknown>;
  eventId?: string;
};

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  'http://localhost:3000';

const stageOrder: TelemetryStage[] = ['buffer', 'intent', 'persona', 'tools', 'response', 'send'];

const stageLabels: Record<TelemetryStage, string> = {
  buffer: 'Buffer',
  intent: 'Intent',
  persona: 'Persona',
  tools: 'Tools',
  response: 'Response',
  send: 'Send'
};

const statusBadge: Record<'idle' | TelemetryStatus, { label: string; tone: string }> = {
  idle: { label: 'Idle', tone: 'text-slate-300 border-slate-700/80 bg-slate-900/80' },
  success: { label: 'Success', tone: 'text-emerald-200 border-emerald-500/60 bg-emerald-500/10' },
  error: { label: 'Error', tone: 'text-rose-200 border-rose-500/60 bg-rose-500/10' }
};

const initialStageState = stageOrder.reduce<Record<TelemetryStage, StageSnapshot>>(
  (acc, stage) => {
    acc[stage] = { status: 'idle', updatedAt: null };
    return acc;
  },
  {} as Record<TelemetryStage, StageSnapshot>
);

const TelemetryPage: NextPageWithLayout = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [stageState, setStageState] = useState<Record<TelemetryStage, StageSnapshot>>(
    initialStageState
  );
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const applyEvent = useCallback((event: TelemetryEvent) => {
    setStageState((previous) => ({
      ...previous,
      [event.stage]: {
        status: event.status,
        updatedAt: Date.now(),
        durationMs: event.durationMs,
        persona: event.persona,
        model: event.model,
        meta: event.meta,
        eventId: event.id
      }
    }));
  }, []);

  const handleIncomingEvent = useCallback(
    (event: TelemetryEvent) => {
      applyEvent(event);
      setEvents((previous) => {
        const filtered = previous.filter((entry) => entry.id !== event.id);
        return [event, ...filtered].slice(0, 100);
      });
    },
    [applyEvent]
  );

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${apiBase}/telemetry/history`);
        if (!response.ok) return;
        const payload = (await response.json()) as { events?: TelemetryEvent[] };
        if (!isMounted || !payload?.events?.length) return;
        payload.events.forEach((event) => applyEvent(event));
        setEvents(payload.events.slice().reverse());
      } catch (error) {
        console.error('Failed to load telemetry history', error);
      }
    };

    void fetchHistory();

    const source = new EventSource(`${apiBase}/telemetry/stream`);
    const onTelemetry = (message: MessageEvent) => {
      try {
        const parsed = JSON.parse(message.data) as TelemetryEvent;
        handleIncomingEvent(parsed);
      } catch (error) {
        console.error('Failed to parse telemetry event', error);
      }
    };
    source.addEventListener('telemetry', onTelemetry);
    source.onerror = () => {
      source.close();
    };

    return () => {
      isMounted = false;
      source.removeEventListener('telemetry', onTelemetry);
      source.close();
    };
  }, [applyEvent, handleIncomingEvent]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stageCards = useMemo(
    () =>
      stageOrder.map((stage, index) => {
        const snapshot = stageState[stage];
        const recent =
          snapshot.updatedAt !== null &&
          currentTime - snapshot.updatedAt < 15_000 &&
          snapshot.status !== 'idle';
        const effectiveStatus =
          recent && snapshot.status !== 'idle' ? snapshot.status : ('idle' as const);
        const tone = statusBadge[effectiveStatus];

        return (
          <div key={stage} className="flex items-center gap-4">
            <div
              className={[
                'w-full rounded-2xl border px-5 py-4 transition-all duration-200',
                tone.tone,
                recent ? 'shadow-[0_0_25px_-12px_rgba(16,185,129,0.75)]' : 'shadow-[0_0_18px_-14px_rgba(15,23,42,0.8)]'
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-50">{stageLabels[stage]}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 text-xs font-medium">
                    {tone.label}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-300/70">
                  {snapshot.durationMs !== undefined ? (
                    <p className="font-mono text-sm text-slate-100">{snapshot.durationMs} ms</p>
                  ) : (
                    <p className="font-mono text-sm text-slate-500">—</p>
                  )}
                  {snapshot.persona ? <p>Persona: {snapshot.persona}</p> : null}
                  {snapshot.model ? <p>Model: {snapshot.model}</p> : null}
                </div>
              </div>
            </div>
            {index < stageOrder.length - 1 ? (
              <span className="hidden text-lg text-slate-500 sm:block">→</span>
            ) : null}
          </div>
        );
      }),
    [currentTime, stageState]
  );

  return (
    <>
      <Head>
        <title>Realtime Telemetriya | NexusCore-WA</title>
      </Head>
      <SectionCard
        title="Flow Canvas"
        description="Agent pipeline mərhələlərinin canlı statusu və müddətləri."
      >
        <div className="flex flex-col gap-4">{stageCards}</div>
      </SectionCard>

      <SectionCard
        title="Son Telemetriya Eventləri"
        description="100 eventlik tarixçə. Redis stream ilə realtime sinkron saxlanılır."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="border-b border-slate-800/60 px-3 py-3">Zaman</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Stage</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Status</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Çat</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Persona/Model</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Müddət (ms)</th>
                <th className="border-b border-slate-800/60 px-3 py-3">Meta</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const date = new Date(event.timestamp);
                const badge = statusBadge[event.status];
                const meta =
                  event.meta && Object.keys(event.meta).length
                    ? JSON.stringify(event.meta)
                    : '—';
                return (
                  <tr key={event.id} className="border-b border-slate-800/40 text-slate-200">
                    <td className="px-3 py-3 font-mono text-xs text-slate-400">
                      {date.toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-3">{stageLabels[event.stage]}</td>
                    <td className="px-3 py-3">
                      <span
                        className={[
                          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                          badge.tone
                        ].join(' ')}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-400">{event.chatId}</td>
                    <td className="px-3 py-3 text-xs text-slate-300">
                      {event.persona ?? '—'}
                      {event.model ? ` · ${event.model}` : ''}
                    </td>
                    <td className="px-3 py-3">{event.durationMs ?? '—'}</td>
                    <td className="px-3 py-3 text-xs text-slate-400">{meta}</td>
                  </tr>
                );
              })}
              {!events.length ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-400">
                    Hələ event daxil olmayıb. Agent trafiki gəldikcə məlumatlar burada görünəcək.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
};

TelemetryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout
      title="Realtime Telemetriya"
      description="Agent pipeline-ının mərhələlərinə dair canlı status, müddət və meta məlumatlarını izləyin."
    >
      {page}
    </AppLayout>
  );
};

export default TelemetryPage;
