import { getJobPostings } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PostingsPage() {
  const postings = await getJobPostings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Postings"
        subtitle="Manage published job listings across all boards"
        icon="🏢"
      />

      {postings.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No Job Postings Yet"
          description="Job postings will appear here once created in your Cosmic dashboard."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {postings.map((posting) => {
            const positionTitle = getMetafieldValue(posting.metadata?.position_title) || posting.title;
            const location = getMetafieldValue(posting.metadata?.location);
            const employmentType = getMetafieldValue(posting.metadata?.employment_type);
            const postingStatus = getMetafieldValue(posting.metadata?.posting_status);
            const salaryMin = posting.metadata?.salary_min;
            const salaryMax = posting.metadata?.salary_max;
            const deadline = getMetafieldValue(posting.metadata?.application_deadline);
            const boards = getMetafieldValue(posting.metadata?.posted_boards);

            return (
              <Link key={posting.id} href={`/postings/${posting.slug}`} className="card hover:shadow-cardHover transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {positionTitle}
                    </h3>
                    {postingStatus && <StatusBadge status={postingStatus} type="posting" />}
                  </div>
                  <div className="space-y-2">
                    {location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <span>📍</span> {location}
                      </p>
                    )}
                    {employmentType && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <span>💼</span> {employmentType}
                      </p>
                    )}
                    {(typeof salaryMin === 'number' || typeof salaryMax === 'number') && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <span>💰</span>
                        {typeof salaryMin === 'number' && typeof salaryMax === 'number'
                          ? `$${salaryMin.toLocaleString()} – $${salaryMax.toLocaleString()}`
                          : typeof salaryMin === 'number'
                          ? `From $${salaryMin.toLocaleString()}`
                          : `Up to $${(salaryMax as number).toLocaleString()}`}
                      </p>
                    )}
                    {deadline && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <span>📅</span> Deadline: {new Date(deadline).toLocaleDateString()}
                      </p>
                    )}
                    {boards && (
                      <p className="text-xs text-gray-400 mt-2">
                        Boards: {boards}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}