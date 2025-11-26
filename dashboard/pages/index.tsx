import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data } = useSWR('/api/status', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false
  });

  return (
    <>
      <Head>
        <title>NexusCore-WA Dashboard</title>
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
          <section>
            <h1 className="text-3xl font-semibold">NexusCore-WA Control Tower</h1>
            <p className="mt-2 text-sm text-slate-300">
              Live health-status and operator overrides for the WhatsApp automation
              stack.
            </p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-medium">Stack Health</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data?.services?.map(
                (service: { name: string; status: string; updatedAt: string }) => (
                  <article
                    key={service.name}
                    className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{service.name}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.status === 'ok'
                            ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
                            : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30'
                        }`}
                      >
                        {service.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Updated: {new Date(service.updatedAt).toLocaleString()}
                    </p>
                  </article>
                )
              ) ?? (
                <p className="text-sm text-slate-400">
                  Waiting for backend heartbeat…
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
