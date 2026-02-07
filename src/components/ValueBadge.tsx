'use client';

interface ValueBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  percentage: number;
}

export default function ValueBadge({ level, percentage }: ValueBadgeProps) {
  const colors = {
    HIGH: 'bg-green-100 text-green-800 border-green-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    LOW: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const labels = {
    HIGH: '🚀 HIGH VALUE',
    MEDIUM: '✓ MEDIUM VALUE',
    LOW: '- LOW VALUE',
  };

  return (
    <div className={`border px-3 py-1 rounded-full text-xs font-semibold ${colors[level]}`}>
      {labels[level]} {percentage > 0 && `+${percentage.toFixed(1)}%`}
    </div>
  );
}
