import useSWR from 'swr';
import type { ReactElement } from 'react';
import { SectionCard } from '../components/Common/SectionCard';
import { EnvEditor, type EnvVariableEntry } from '../components/Config/EnvEditor';
import { AppLayout } from '../components/Layout/AppLayout';
import type { NextPageWithLayout } from './_app';

type EnvConfigResponse = {
  env: {
    entries: EnvVariableEntry[];
    path: string;
    updatedAt: string | null;
  };
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

const EnvironmentPage: NextPageWithLayout = () => {
  const { data, mutate, isValidating } = useSWR<EnvConfigResponse>('/api/config', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false
  });

  async function handleEnvSave(changes: Array<{ key: string; value: string }>): Promise<void> {
    const response = await fetch('/api/config/env', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: changes })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error ?? '.env yenilənmədi');
    }
    await mutate();
  }

  return (
    <SectionCard
      title=".env idarəetməsi"
      description="Model açarlarını, WhatsApp gateway bağlantılarını və digər agent parametrlərini yeniləyin."
      actions={
        isValidating ? <span className="text-xs text-emerald-200/70">Konfiqurasiya yenilənir…</span> : null
      }
    >
      {data ? (
        <EnvEditor
          entries={data.env.entries}
          path={data.env.path}
          updatedAt={data.env.updatedAt}
          onSave={handleEnvSave}
        />
      ) : (
        <div className="rounded-xl border border-slate-800/60 bg-slate-950/70 px-4 py-8 text-center text-sm text-slate-400">
          .env məlumatı yüklənir…
        </div>
      )}
    </SectionCard>
  );
};

EnvironmentPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout
      title="Konfiqurasiya və Ətraf Mühit Dəyərləri"
      description="NexusCore üçün modellər, WhatsApp gateway və digər kritik parametrləri təhlükəsiz şəkildə idarə edin."
    >
      {page}
    </AppLayout>
  );
};

export default EnvironmentPage;
