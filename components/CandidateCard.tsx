import type { Candidate } from '@/types';
import { getMetafieldValue } from '@/types';
import Link from 'next/link';
import Tooltip from '@/components/Tooltip';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const name = getMetafieldValue(candidate.metadata?.full_name) || candidate.title;
  const email = getMetafieldValue(candidate.metadata?.email);
  const source = getMetafieldValue(candidate.metadata?.source);
  const appliedDate = getMetafieldValue(candidate.metadata?.applied_date);
  const score = candidate.metadata?.ai_ranking_score;
  const tags = getMetafieldValue(candidate.metadata?.tags);

  const position = candidate.metadata?.applied_position;
  const positionTitle = position && typeof position === 'object' && 'title' in position
    ? String(position.title) : '';

  const stage = candidate.metadata?.current_stage;
  const stageName = stage && typeof stage === 'object' && 'metadata' in stage
    ? getMetafieldValue((stage as { metadata?: { stage_name?: unknown } }).metadata?.stage_name) || ''
    : '';
  const stageColor = stage && typeof stage === 'object' && 'metadata' in stage
    ? getMetafieldValue((stage as { metadata?: { stage_color?: unknown } }).metadata?.stage_color) || '#6b7280'
    : '#6b7280';

  return (
    <Tooltip content={`Click to view ${name}'s full profile`}>
      <Link href={`/candidates/${candidate.slug}`} className="card hover:shadow-cardHover transition-all block">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                {positionTitle && <p className="text-xs text-gray-500">{positionTitle}</p>}
              </div>
            </div>
            {typeof score === 'number' && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                score >= 80 ? 'bg-green-100 text-green-700' :
                score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {score}/100
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {email && <p className="text-xs text-gray-500 truncate">📧 {email}</p>}
            {source && <p className="text-xs text-gray-500">📌 {source}</p>}
            {appliedDate && <p className="text-xs text-gray-400">📅 {new Date(appliedDate).toLocaleDateString()}</p>}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {stageName ? (
              <span
                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: stageColor }}
              >
                {stageName}
              </span>
            ) : (
              <span className="text-xs text-gray-400">No stage</span>
            )}
            {tags && (
              <div className="flex gap-1">
                {tags.split(',').slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Tooltip>
  );
}