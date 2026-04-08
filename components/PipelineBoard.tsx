import type { PipelineStage, Candidate } from '@/types';
import { getMetafieldValue } from '@/types';
import Link from 'next/link';

interface PipelineBoardProps {
  stages: PipelineStage[];
  candidates: Candidate[];
}

export default function PipelineBoard({ stages, candidates }: PipelineBoardProps) {
  const getCandidatesForStage = (stageId: string): Candidate[] => {
    return candidates.filter((c) => {
      const currentStage = c.metadata?.current_stage;
      if (!currentStage || typeof currentStage !== 'object') return false;
      return 'id' in currentStage && currentStage.id === stageId;
    });
  };

  // Group candidates without a stage
  const unassigned = candidates.filter((c) => {
    const currentStage = c.metadata?.current_stage;
    if (!currentStage || typeof currentStage !== 'object' || !('id' in currentStage)) return true;
    return !stages.some((s) => s.id === (currentStage as { id: string }).id);
  });

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {/* Unassigned column */}
        {unassigned.length > 0 && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-gray-200 rounded-t-lg px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Unassigned</h3>
              <span className="bg-gray-300 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {unassigned.length}
              </span>
            </div>
            <div className="bg-gray-50 rounded-b-lg p-3 space-y-2 min-h-[200px]">
              {unassigned.map((candidate) => (
                <PipelineCandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </div>
        )}

        {stages.map((stage) => {
          const stageName = getMetafieldValue(stage.metadata?.stage_name) || stage.title;
          const stageColor = getMetafieldValue(stage.metadata?.stage_color) || '#3b82f6';
          const isFinal = stage.metadata?.is_final_stage;
          const stageCandidates = getCandidatesForStage(stage.id);

          return (
            <div key={stage.id} className="w-72 flex-shrink-0">
              <div
                className="rounded-t-lg px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: stageColor + '20', borderLeft: `4px solid ${stageColor}` }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-800">{stageName}</h3>
                  {isFinal && <span className="text-xs">🏁</span>}
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: stageColor }}
                >
                  {stageCandidates.length}
                </span>
              </div>
              <div className="bg-gray-50 rounded-b-lg p-3 space-y-2 min-h-[200px] border border-t-0 border-gray-200">
                {stageCandidates.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">No candidates</p>
                ) : (
                  stageCandidates.map((candidate) => (
                    <PipelineCandidateCard key={candidate.id} candidate={candidate} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCandidateCard({ candidate }: { candidate: Candidate }) {
  const name = getMetafieldValue(candidate.metadata?.full_name) || candidate.title;
  const score = candidate.metadata?.ai_ranking_score;
  const source = getMetafieldValue(candidate.metadata?.source);

  const position = candidate.metadata?.applied_position;
  const positionTitle = position && typeof position === 'object' && 'title' in position
    ? String(position.title) : '';

  return (
    <Link
      href={`/candidates/${candidate.slug}`}
      className="block bg-white rounded-lg p-3 border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{name}</p>
            {positionTitle && <p className="text-xs text-gray-500">{positionTitle}</p>}
          </div>
        </div>
        {typeof score === 'number' && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            score >= 80 ? 'bg-green-100 text-green-700' :
            score >= 60 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {score}
          </span>
        )}
      </div>
      {source && (
        <p className="text-xs text-gray-400 mt-2">via {source}</p>
      )}
    </Link>
  );
}