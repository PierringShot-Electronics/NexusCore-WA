import useSWR from 'swr';
import type { ReactElement } from 'react';
import { SectionCard } from '../components/Common/SectionCard';
import { PromptEditor } from '../components/Config/PromptEditor';
import {
  AgentConfigForm,
  type AgentConfig,
  type AgentConfigUpdatePayload
} from '../components/Config/AgentConfigForm';
import { AppLayout } from '../components/Layout/AppLayout';
import type { NextPageWithLayout } from './_app';

type AdminConfigResponse = {
  prompt: {
    path: string;
    content: string;
    updatedAt: string | null;
  };
  agent: {
    settings: AgentConfig;
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

const AgentPage: NextPageWithLayout = () => {
  const {
    data: configData,
    mutate,
    isValidating
  } = useSWR<AdminConfigResponse>('/api/config', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false
  });

  async function handlePromptSave(nextContent: string): Promise<void> {
    const response = await fetch('/api/config/prompt', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: nextContent })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Backend prompt yenilənmədi');
    }
    await mutate();
  }

  async function handleAgentConfigSave(update: AgentConfigUpdatePayload): Promise<void> {
    const response = await fetch('/api/config/agent', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Agent parametrləri yenilənmədi');
    }
    await mutate();
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Biznes Promptu"
        description="Agentin əsas kontekstini dəyişdirərək davranışı tez adaptasiya edin."
        actions={
          isValidating ? <span className="text-xs text-emerald-200/70">Konfiqurasiya yenilənir…</span> : null
        }
      >
        {configData ? (
          <PromptEditor
            content={configData.prompt.content}
            path={configData.prompt.path}
            updatedAt={configData.prompt.updatedAt}
            onSave={handlePromptSave}
          />
        ) : (
          <Placeholder label="Biznes promptu yüklənir…" />
        )}
      </SectionCard>

      <SectionCard
        title="Heuristika və Multimodal Parametrlər"
        description="Regex açar sözləri, vision limitləri və log saxlanma konfiqurasiyasını idarə edin."
      >
        {configData ? (
          <AgentConfigForm
            config={configData.agent.settings}
            path={configData.agent.path}
            updatedAt={configData.agent.updatedAt}
            onSave={handleAgentConfigSave}
          />
        ) : (
          <Placeholder label="Agent parametrləri yüklənir…" />
        )}
      </SectionCard>
    </div>
  );
};

AgentPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout
      title="Agent Orkestratoru"
      description="Biznes promptlarını, heuristika parametrlərini və multimodal davranış qıraqlarını idarə edin."
    >
      {page}
    </AppLayout>
  );
};

export default AgentPage;

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-950/70 px-4 py-8 text-center text-sm text-slate-400">
      {label}
    </div>
  );
}
