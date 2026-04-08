// app/candidates/[slug]/page.tsx
import { getCandidate, getActivitiesForCandidate } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import ActivityFeed from '@/components/ActivityFeed';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const candidate = await getCandidate(slug);

  if (!candidate) {
    notFound();
  }

  const activities = await getActivitiesForCandidate(candidate.id);

  const name = getMetafieldValue(candidate.metadata?.full_name) || candidate.title;
  const email = getMetafieldValue(candidate.metadata?.email);
  const phone = getMetafieldValue(candidate.metadata?.phone);
  const source = getMetafieldValue(candidate.metadata?.source);
  const appliedDate = getMetafieldValue(candidate.metadata?.applied_date);
  const tags = getMetafieldValue(candidate.metadata?.tags);
  const score = candidate.metadata?.ai_ranking_score;
  const reasoning = getMetafieldValue(candidate.metadata?.ai_ranking_reasoning);
  const parsedResume = getMetafieldValue(candidate.metadata?.parsed_resume_data);
  const inTalentPool = candidate.metadata?.in_talent_pool;

  const position = candidate.metadata?.applied_position;
  const positionTitle = position && typeof position === 'object' && 'title' in position
    ? String(position.title) : '';

  const stage = candidate.metadata?.current_stage;
  const stageName = stage && typeof stage === 'object' && 'metadata' in stage
    ? getMetafieldValue((stage as { metadata?: { stage_name?: unknown } }).metadata?.stage_name) || ''
    : '';
  const stageColor = stage && typeof stage === 'object' && 'metadata' in stage
    ? getMetafieldValue((stage as { metadata?: { stage_color?: unknown } }).metadata?.stage_color) || '#3b82f6'
    : '#3b82f6';

  const resumeFile = candidate.metadata?.resume_file;
  const resumeUrl = resumeFile && typeof resumeFile === 'object' && 'url' in resumeFile
    ? String(resumeFile.url) : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/candidates" className="hover:text-brand-600">Candidates</Link>
        <span>/</span>
        <span className="text-gray-900">{name}</span>
      </div>

      <PageHeader
        title={name}
        subtitle={positionTitle || 'No position assigned'}
        icon="👤"
        actions={
          <div className="flex items-center gap-2">
            {inTalentPool && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                🌟 Talent Pool
              </span>
            )}
            {stageName && (
              <span
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: stageColor }}
              >
                {stageName}
              </span>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Score */}
          {typeof score === 'number' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🤖 AI Ranking Score
                </h2>
              </div>
              <div className="card-body">
                <div className="flex items-center gap-6 mb-4">
                  <div className={`text-4xl font-bold ${
                    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {score}<span className="text-lg text-gray-400">/100</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
                {reasoning && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">AI Reasoning</p>
                    <p className="text-sm text-gray-700">{reasoning}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parsed Resume */}
          {parsedResume && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">📄 Parsed Resume Data</h2>
              </div>
              <div className="card-body">
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto text-gray-700 whitespace-pre-wrap">
                  {parsedResume}
                </pre>
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>
            </div>
            <div className="card-body space-y-4">
              {email && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-brand-600 hover:text-brand-700 mt-1 block">{email}</a>
                </div>
              )}
              {phone && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                  <p className="text-sm text-gray-900 mt-1">{phone}</p>
                </div>
              )}
              {source && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Source</p>
                  <p className="text-sm text-gray-900 mt-1">{source}</p>
                </div>
              )}
              {appliedDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Applied Date</p>
                  <p className="text-sm text-gray-900 mt-1">{new Date(appliedDate).toLocaleDateString()}</p>
                </div>
              )}
              {tags && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {resumeUrl && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Resume</p>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-2 text-xs">
                    📎 Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}