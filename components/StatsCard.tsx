import Tooltip from '@/components/Tooltip';

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  tooltip: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'bg-purple-100',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: 'bg-orange-100',
  },
};

export default function StatsCard({ title, value, icon, color, tooltip }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <Tooltip content={tooltip}>
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}