import type { ReactNode } from 'react';

export interface NavItem {
  key: string;
  label: string;
  description?: string;
  icon: ReactNode;
}

interface SideNavProps {
  items: NavItem[];
  activeKey: string;
  collapsed: boolean;
  onSelect: (key: string) => void;
  onToggle: () => void;
}

export function SideNav({ items, activeKey, collapsed, onSelect, onToggle }: SideNavProps) {
  return (
    <aside
      className={cx(
        'relative flex flex-col border-r border-slate-800/60 bg-slate-950/70 backdrop-blur transition-all duration-300',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div
          className={cx(
            'text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300 transition-opacity duration-300',
            collapsed ? 'opacity-0' : 'opacity-100'
          )}
        >
          NexusCore
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
          aria-label={collapsed ? 'Menunu aç' : 'Menunu gizlət'}
        >
          <MenuIcon collapsed={collapsed} />
        </button>
      </div>
      <nav className="flex-1 space-y-2 px-2 py-4">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
            className={cx(
              'group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-3 text-left transition-all duration-300',
              'hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200',
              isActive
                ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-200 shadow-[0_10px_40px_-20px_rgba(16,185,129,0.65)]'
                : 'text-slate-300'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={cx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800/80 bg-slate-900/80 transition-all duration-300',
                  isActive ? 'border-emerald-500/70 text-emerald-200' : 'group-hover:border-emerald-400/40'
                )}
              >
                {item.icon}
              </span>
              <span
                className={cx(
                  'flex flex-col transition-all duration-300',
                  collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
                )}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                {item.description ? (
                  <span className="text-xs text-slate-400">{item.description}</span>
                ) : null}
              </span>
              {isActive ? (
                <span className="absolute inset-y-1 left-1 w-[3px] rounded-full bg-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-300" />
              ) : null}
            </button>
          );
        })}
      </nav>
      <div className="px-4 pb-6 text-xs text-slate-500">
        {collapsed
          ? '⚙️'
          : 'Agent parametrlərini yenilədikdən sonra backend-i qısa müddətə yenidən başladın ki, env dəyişiklikləri tam tətbiq olunsun.'}
      </div>
    </aside>
  );
}

function MenuIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cx('h-5 w-5 transition-transform duration-300', collapsed ? 'rotate-180' : 'rotate-0')}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
