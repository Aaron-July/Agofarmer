import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let colorClass = 'bg-gray-100 text-gray-700';

  const s = status.toUpperCase();
  if (s === 'OPEN' || s === 'AVAILABLE') colorClass = 'bg-green-100 text-green-700';
  else if (s === 'IN_PROGRESS' || s === 'PENDING') colorClass = 'bg-blue-100 text-blue-700';
  else if (s === 'COMPLETED' || s === 'CONFIRMED') colorClass = 'bg-gray-100 text-gray-700';
  else if (s === 'CANCELLED') colorClass = 'bg-red-100 text-red-700';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass} ${className}`}>
      {status.replace('_', ' ')}
    </span>
  );
};