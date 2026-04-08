import { getCandidates } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import CandidateCard from '@/components/CandidateCard';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  const sortedCandidates = candidates.sort((a, b) => {
    const dateA = new Date(a.metadata?.applied_date || a.created_at).getTime();
    const dateB = new Date(b.metadata?.applied_date || b.created_at).getTime();
    return dateB - dateA;
  });

  const talentPool = sortedCandidates.filter((c) => c.metadata?.in_talent_pool === true);
  const activeCandidates = sortedCandidates.filter((c) => !c.metadata?.in_talent_pool);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates in database`}
        icon="👤"
      />

      {candidates.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No Candidates Yet"
          description="Candidates will appear here once added in your Cosmic dashboard."
        />
      ) : (
        <div className="space-y-8">
          {/* Active Candidates */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Candidates ({activeCandidates.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
            {activeCandidates.length === 0 && (
              <p className="text-sm text-gray-400 italic">No active candidates</p>
            )}
          </div>

          {/* Talent Pool */}
          {talentPool.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🌟</span> Talent Pool ({talentPool.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {talentPool.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}