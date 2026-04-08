import type { CandidateActivity } from '@/types';
import { getMetafieldValue } from '@/types';
import StatusBadge from '@/components/StatusBadge';

interface ActivityFeedProps {
  activities: CandidateActivity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.metadata?.activity_date || a.created_at).getTime();
    const dateB = new Date(b.metadata?.activity_date || b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">💬 Activity Feed</h2>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <span className="text-4xl mb-3 block">💬</span>
          <p className="text-sm text-gray-500">No activities yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sortedActivities.map((activity) => {
            const activityType = getMetafieldValue(activity.metadata?.activity_type);
            const content = getMetafieldValue(activity.metadata?.content);
            const rating = activity.metadata?.rating;
            const activityDate = getMetafieldValue(activity.metadata?.activity_date) || activity.created_at;
            const interviewDetails = getMetafieldValue(activity.metadata?.interview_details);

            const actor = activity.metadata?.actor;
            const actorName = actor && typeof actor === 'object' && 'title' in actor
              ? String(actor.title) : 'System';

            return (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {activityType === 'Comment' ? '💬' :
                     activityType === 'Rating' ? '⭐' :
                     activityType === 'Interview' ? '📅' :
                     activityType === 'Email' ? '📧' :
                     activityType === 'Status Change' ? '🔄' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{actorName}</span>
                      {activityType && <StatusBadge status={activityType} type="activity" />}
                      <span className="text-xs text-gray-400">
                        {new Date(activityDate).toLocaleString()}
                      </span>
                    </div>
                    {content && (
                      <p className="text-sm text-gray-700 mt-1">{content}</p>
                    )}
                    {typeof rating === 'number' && (
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
                      </div>
                    )}
                    {interviewDetails && (
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Interview Details</p>
                        <p className="text-sm text-gray-700">{interviewDetails}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}