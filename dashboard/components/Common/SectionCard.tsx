import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 shadow-[0_20px_60px_-30px_rgba(16,185,129,0.45)] transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_30px_80px_-40px_rgba(16,185,129,0.65)]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-slate-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col gap-4 p-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            {description ? <p className="text-sm text-slate-400">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
