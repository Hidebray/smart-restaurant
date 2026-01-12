
import React from 'react';
import { TableStatus } from '../../types';

interface BadgeProps {
  status: TableStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusStyles: { [key in TableStatus]: { text: string; bg: string; } } = {
    [TableStatus.AVAILABLE]: { text: 'text-green-800', bg: 'bg-green-100' },
    [TableStatus.OCCUPIED]: { text: 'text-red-800', bg: 'bg-red-100' },
    [TableStatus.RESERVED]: { text: 'text-blue-800', bg: 'bg-blue-100' },
    [TableStatus.INACTIVE]: { text: 'text-gray-800', bg: 'bg-gray-200' },
  };

  const statusMap: { [key in TableStatus]: string } = {
    [TableStatus.AVAILABLE]: 'Trống',
    [TableStatus.OCCUPIED]: 'Có khách',
    [TableStatus.RESERVED]: 'Đã đặt',
    [TableStatus.INACTIVE]: 'Không hoạt động',
  };

  const { text, bg } = statusStyles[status] || statusStyles[TableStatus.INACTIVE];
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
