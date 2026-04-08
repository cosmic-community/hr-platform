interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'priority' | 'offer' | 'posting' | 'activity';
}

const statusStyles: Record<string, string> = {
  // Requisition statuses
  'Draft': 'bg-gray-100 text-gray-700',
  'Pending Approval': 'bg-yellow-100 text-yellow-700',
  'Approved': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Filled': 'bg-blue-100 text-blue-700',
  'Cancelled': 'bg-gray-100 text-gray-500',
  // Posting statuses
  'Active': 'bg-green-100 text-green-700',
  'Paused': 'bg-yellow-100 text-yellow-700',
  'Closed': 'bg-gray-100 text-gray-600',
  'Expired': 'bg-red-100 text-red-600',
  // Offer statuses
  'Sent': 'bg-blue-100 text-blue-700',
  'Accepted': 'bg-green-100 text-green-700',
  'Withdrawn': 'bg-gray-100 text-gray-600',
  // Priority
  'Low': 'bg-gray-100 text-gray-600',
  'Medium': 'bg-blue-100 text-blue-700',
  'High': 'bg-orange-100 text-orange-700',
  'Urgent': 'bg-red-100 text-red-700',
  // Activity types
  'Comment': 'bg-blue-100 text-blue-700',
  'Rating': 'bg-yellow-100 text-yellow-700',
  'Status Change': 'bg-purple-100 text-purple-700',
  'Interview': 'bg-indigo-100 text-indigo-700',
  'Email': 'bg-cyan-100 text-cyan-700',
  'Note': 'bg-gray-100 text-gray-600',
  // Audit actions
  'Create': 'bg-green-100 text-green-700',
  'Update': 'bg-blue-100 text-blue-700',
  'Delete': 'bg-red-100 text-red-700',
  'View': 'bg-gray-100 text-gray-600',
  'Export': 'bg-purple-100 text-purple-700',
  'Login': 'bg-cyan-100 text-cyan-700',
  'Approve': 'bg-green-100 text-green-700',
  'Reject': 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}