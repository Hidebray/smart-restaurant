
import React from 'react';
import { TableStatus } from '../../types';

interface BadgeProps {
  status: TableStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusStyles: { [key in TableStatus]: { text: string; bg: string; } } = {
    'AVAILABLE': { text: 'text-green-800', bg: 'bg-green-100' },
    'OCCUPIED': { text: 'text-red-800', bg: 'bg-red-100' },
    'RESERVED': { text: 'text-blue-800', bg: 'bg-blue-100' },
    'INACTIVE': { text: 'text-gray-800', bg: 'bg-gray-200' },
  };

  const statusMap: { [key in TableStatus]: string } = {
    'AVAILABLE': 'Trống',
    'OCCUPIED': 'Có khách',
    'RESERVED': 'Đã đặt',
    'INACTIVE': 'Không hoạt động',
  };

  const { text, bg } = statusStyles[status] || statusStyles['INACTIVE'];
  const label = statusMap[status] || 'Không xác định';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

export default Badge;
