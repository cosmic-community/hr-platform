import { getDashboardStats } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import StatsCard from '@/components/StatsCard';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stats = await getDashboardStats();

  const recentCandidates = stats.candidates
    .sort((a, b) => {
      const dateA = new Date(a.metadata?.applied_date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.applied_date || b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const recentRequisitions = stats.requisitions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your HR Recruitment Platform"
        icon="📊"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Open Requisitions"
          value={stats.openRequisitions}
          icon="📋"
          color="blue"
          tooltip="Number of approved job requisitions awaiting candidates"
        />
        <StatsCard
          title="Active Postings"
          value={stats.activePostings}
          icon="🏢"
          color="green"
          tooltip="Currently published job postings across all boards"
        />
        <StatsCard
          title="Total Candidates"
          value={stats.totalCandidates}
          icon="👤"
          color="purple"
          tooltip="All candidates in the recruitment pipeline"
        />
        <StatsCard
          title="Pending Offers"
          value={stats.pendingOffers}
          icon="📨"
          color="orange"
          tooltip="Offer letters sent and awaiting candidate response"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Candidates</h2>
            <Link href="/candidates" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCandidates.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No candidates yet. Add candidates in your Cosmic dashboard.
              </div>
            ) : (
              recentCandidates.map((candidate) => {
                const name = getMetafieldValue(candidate.metadata?.full_name) || candidate.title;
                const position = candidate.metadata?.applied_position;
                const positionTitle = position && typeof position === 'object' && 'title' in position
                  ? String(position.title)
                  : 'No position';
                const score = candidate.metadata?.ai_ranking_score;
                const source = getMetafieldValue(candidate.metadata?.source);

                return (
                  <Link
                    key={candidate.id}
                    href={`/candidates/${candidate.slug}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500">{positionTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {source && (
                        <span className="text-xs text-gray-400">{source}</span>
                      )}
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
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Requisitions */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Requisitions</h2>
            <Link href="/requisitions" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRequisitions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No requisitions yet. Create them in your Cosmic dashboard.
              </div>
            ) : (
              recentRequisitions.map((req) => {
                const jobTitle = getMetafieldValue(req.metadata?.job_title) || req.title;
                const department = getMetafieldValue(req.metadata?.department);
                const status = getMetafieldValue(req.metadata?.status);
                const priority = getMetafieldValue(req.metadata?.priority);

                return (
                  <Link
                    key={req.id}
                    href={`/requisitions/${req.slug}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{jobTitle}</p>
                      <p className="text-xs text-gray-500">{department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {priority && (
                        <StatusBadge status={priority} type="priority" />
                      )}
                      {status && (
                        <StatusBadge status={status} type="status" />
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/requisitions" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all group">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700">Requisitions</p>
                <p className="text-xs text-gray-500">Manage job requisitions</p>
              </div>
            </Link>
            <Link href="/pipeline" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all group">
              <span className="text-2xl">🔀</span>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700">Pipeline</p>
                <p className="text-xs text-gray-500">View recruitment pipeline</p>
              </div>
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all group">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700">Analytics</p>
                <p className="text-xs text-gray-500">View reports & metrics</p>
              </div>
            </Link>
            <Link href="/audit-logs" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-all group">
              <span className="text-2xl">📝</span>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700">Audit Logs</p>
                <p className="text-xs text-gray-500">Compliance & security</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}