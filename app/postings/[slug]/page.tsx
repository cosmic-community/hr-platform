// app/postings/[slug]/page.tsx
import { getJobPosting } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posting = await getJobPosting(slug);

  if (!posting) {
    notFound();
  }

  const positionTitle = getMetafieldValue(posting.metadata?.position_title) || posting.title;
  const location = getMetafieldValue(posting.metadata?.location);
  const employmentType = getMetafieldValue(posting.metadata?.employment_type);
  const postingStatus = getMetafieldValue(posting.metadata?.posting_status);
  const jobDescription = getMetafieldValue(posting.metadata?.job_description);
  const requirements = getMetafieldValue(posting.metadata?.requirements);
  const salaryMin = posting.metadata?.salary_min;
  const salaryMax = posting.metadata?.salary_max;
  const deadline = getMetafieldValue(posting.metadata?.application_deadline);
  const boards = getMetafieldValue(posting.metadata?.posted_boards);
  const embedCode = getMetafieldValue(posting.metadata?.career_site_embed);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/postings" className="hover:text-brand-600">Job Postings</Link>
        <span>/</span>
        <span className="text-gray-900">{positionTitle}</span>
      </div>

      <PageHeader
        title={positionTitle}
        subtitle={[location, employmentType].filter(Boolean).join(' • ')}
        icon="🏢"
        actions={postingStatus ? <StatusBadge status={postingStatus} type="posting" /> : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
            </div>
            <div className="card-body prose prose-sm max-w-none text-gray-700">
              {jobDescription ? (
                <div dangerouslySetInnerHTML={{ __html: jobDescription }} />
              ) : (
                <p className="text-gray-400 italic">No description provided</p>
              )}
            </div>
          </div>

          {requirements && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
              </div>
              <div className="card-body prose prose-sm max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: requirements }} />
              </div>
            </div>
          )}

          {embedCode && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Career Site Embed Code</h2>
              </div>
              <div className="card-body">
                <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto text-gray-700">
                  {embedCode}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Location</p>
                <p className="text-sm text-gray-900 mt-1">{location || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Employment Type</p>
                <p className="text-sm text-gray-900 mt-1">{employmentType || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Salary Range</p>
                <p className="text-sm text-gray-900 mt-1">
                  {typeof salaryMin === 'number' && typeof salaryMax === 'number'
                    ? `$${salaryMin.toLocaleString()} – $${salaryMax.toLocaleString()}`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Application Deadline</p>
                <p className="text-sm text-gray-900 mt-1">
                  {deadline ? new Date(deadline).toLocaleDateString() : '—'}
                </p>
              </div>
              {boards && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Posted Boards</p>
                  <p className="text-sm text-gray-900 mt-1">{boards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}