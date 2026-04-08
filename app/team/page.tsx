import { getTeamMembers } from '@/lib/cosmic';
import { getMetafieldValue } from '@/types';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import Tooltip from '@/components/Tooltip';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        subtitle={`${members.length} team member${members.length !== 1 ? 's' : ''}`}
        icon="👥"
      />

      {members.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Team Members Yet"
          description="Add team members in your Cosmic dashboard to manage your HR team."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member) => {
            const fullName = getMetafieldValue(member.metadata?.full_name) || member.title;
            const email = getMetafieldValue(member.metadata?.email);
            const role = getMetafieldValue(member.metadata?.role);
            const department = getMetafieldValue(member.metadata?.department);
            const phone = getMetafieldValue(member.metadata?.phone);
            const isActive = member.metadata?.active;
            const avatar = member.metadata?.avatar;
            const avatarUrl = avatar && typeof avatar === 'object' && 'imgix_url' in avatar
              ? `${String(avatar.imgix_url)}?w=200&h=200&fit=crop&auto=format,compress`
              : null;

            return (
              <Tooltip key={member.id} content={`${role || 'Team member'} in ${department || 'team'}`}>
                <div className="card p-6 hover:shadow-cardHover transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={fullName}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl font-bold">
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{fullName}</h3>
                        {isActive !== undefined && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      {role && <p className="text-xs text-brand-600 font-medium mt-0.5">{role}</p>}
                      {department && <p className="text-xs text-gray-500 mt-0.5">{department}</p>}
                      <div className="mt-3 space-y-1">
                        {email && (
                          <a href={`mailto:${email}`} className="text-xs text-gray-500 hover:text-brand-600 block truncate">
                            📧 {email}
                          </a>
                        )}
                        {phone && (
                          <p className="text-xs text-gray-500">📞 {phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}