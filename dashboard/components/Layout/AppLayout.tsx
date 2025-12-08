import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const navItems: NavItem[] = [
  { href: '/overview', label: 'Ümumi Panel' },
  { href: '/telemetry', label: 'Realtime Telemetriya' },
  { href: '/agent', label: 'Agent Orkestratoru' },
  { href: '/environment', label: 'Konfiqurasiya' }
];

export function AppLayout({ title, description, children }: AppLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.45em] text-emerald-400/80">
              NexusCore Realtime Console
            </span>
            <h1 className="mt-2 text-2xl font-semibold text-slate-50 lg:text-3xl">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-3xl text-sm text-slate-400">{description}</p>
            ) : null}
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'inline-flex items-center rounded-full border px-4 py-2 text-sm transition-all duration-200',
                    active
                      ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-200 shadow-[0_10px_40px_-25px_rgba(16,185,129,0.75)]'
                      : 'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-emerald-400/50 hover:text-emerald-200'
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-12">
        <div className="grid gap-8">{children}</div>
      </main>
    </div>
  );
}
