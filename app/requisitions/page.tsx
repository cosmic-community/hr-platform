import { getJobRequisitions } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import Tooltip from '@/components/Tooltip';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RequisitionsPage() {
  const requisitions = await getJobRequisitions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Requisitions"
        subtitle="Manage workforce planning and requisition approvals"
        icon="📋"
      />

      {requisitions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Requisitions Yet"
          description="Job requisitions will appear here once created in your Cosmic dashboard."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Headcount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requisitions.map((req) => {
                  const jobTitle = getMetafieldValue(req.metadata?.job_title) || req.title;
                  const department = getMetafieldValue(req.metadata?.department);
                  const headcount = req.metadata?.headcount;
                  const budget = req.metadata?.budget;
                  const currency = getMetafieldValue(req.metadata?.currency) || 'USD';
                  const priority = getMetafieldValue(req.metadata?.priority);
                  const status = getMetafieldValue(req.metadata?.status);
                  const targetDate = getMetafieldValue(req.metadata?.target_start_date);

                  return (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Tooltip content="Click to view requisition details">
                          <Link href={`/requisitions/${req.slug}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                            {jobTitle}
                          </Link>
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{department || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{typeof headcount === 'number' ? headcount : '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {typeof budget === 'number' ? `${currency} ${budget.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {priority ? <StatusBadge status={priority} type="priority" /> : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {status ? <StatusBadge status={status} type="status" /> : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {targetDate ? new Date(targetDate).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}