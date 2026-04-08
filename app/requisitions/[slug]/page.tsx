// app/requisitions/[slug]/page.tsx
import { getJobRequisition } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RequisitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const requisition = await getJobRequisition(slug);

  if (!requisition) {
    notFound();
  }

  const jobTitle = getMetafieldValue(requisition.metadata?.job_title) || requisition.title;
  const department = getMetafieldValue(requisition.metadata?.department);
  const headcount = requisition.metadata?.headcount;
  const budget = requisition.metadata?.budget;
  const currency = getMetafieldValue(requisition.metadata?.currency) || 'USD';
  const status = getMetafieldValue(requisition.metadata?.status);
  const priority = getMetafieldValue(requisition.metadata?.priority);
  const description = getMetafieldValue(requisition.metadata?.description);
  const targetDate = getMetafieldValue(requisition.metadata?.target_start_date);
  const approvalHistory = getMetafieldValue(requisition.metadata?.approval_history);

  const hiringManager = requisition.metadata?.hiring_manager;
  const managerName = hiringManager && typeof hiringManager === 'object' && 'metadata' in hiringManager
    ? getMetafieldValue((hiringManager as { metadata?: { full_name?: unknown } }).metadata?.full_name) || (hiringManager as { title?: string }).title || ''
    : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/requisitions" className="hover:text-brand-600">Requisitions</Link>
        <span>/</span>
        <span className="text-gray-900">{jobTitle}</span>
      </div>

      <PageHeader
        title={jobTitle}
        subtitle={department}
        icon="📋"
        actions={
          <div className="flex items-center gap-2">
            {priority && <StatusBadge status={priority} type="priority" />}
            {status && <StatusBadge status={status} type="status" />}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
            </div>
            <div className="card-body">
              <div className="prose prose-sm max-w-none text-gray-700">
                {description ? (
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Approval History */}
          {approvalHistory && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Approval History</h2>
              </div>
              <div className="card-body">
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: approvalHistory }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Details */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Department</p>
                <p className="text-sm text-gray-900 mt-1">{department || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Headcount</p>
                <p className="text-sm text-gray-900 mt-1">{typeof headcount === 'number' ? headcount : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Budget</p>
                <p className="text-sm text-gray-900 mt-1">
                  {typeof budget === 'number' ? `${currency} ${budget.toLocaleString()}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Hiring Manager</p>
                <p className="text-sm text-gray-900 mt-1">{managerName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Target Start Date</p>
                <p className="text-sm text-gray-900 mt-1">
                  {targetDate ? new Date(targetDate).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Created</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(requisition.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}