import { getPipelineStages, getCandidates } from '@/lib/cosmic';
import PageHeader from '@/components/PageHeader';
import PipelineBoard from '@/components/PipelineBoard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const [stages, candidates] = await Promise.all([
    getPipelineStages(),
    getCandidates(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recruitment Pipeline"
        subtitle="Visual overview of candidates across pipeline stages"
        icon="🔀"
      />

      {stages.length === 0 ? (
        <EmptyState
          icon="🔀"
          title="No Pipeline Stages Configured"
          description="Add pipeline stages in your Cosmic dashboard to visualize the recruitment workflow."
        />
      ) : (
        <PipelineBoard stages={stages} candidates={candidates} />
      )}
    </div>
  );
}