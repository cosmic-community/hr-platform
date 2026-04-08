import { getAuditLogs } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Compliance tracking and security audit trail"
        icon="📝"
      />

      {logs.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No Audit Logs Yet"
          description="Audit logs will appear here as actions are tracked in your system."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => {
                  const actionType = getMetafieldValue(log.metadata?.action_type);
                  const actor = getMetafieldValue(log.metadata?.actor);
                  const entityType = getMetafieldValue(log.metadata?.target_entity_type);
                  const entityId = getMetafieldValue(log.metadata?.target_entity_id);
                  const description = getMetafieldValue(log.metadata?.description);
                  const ipAddress = getMetafieldValue(log.metadata?.ip_address);
                  const timestamp = getMetafieldValue(log.metadata?.log_timestamp) || log.created_at;

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {actionType ? <StatusBadge status={actionType} type="activity" /> : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{actor || '—'}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-700">{entityType || '—'}</p>
                          {entityId && <p className="text-xs text-gray-400 font-mono">{entityId}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{description || '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">{ipAddress || '—'}</td>
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