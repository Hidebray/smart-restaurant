
import React from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: { [key in OrderStatus]: { text: string; bg: string; label: string } } = {
  [OrderStatus.PENDING]: { label: 'Chờ duyệt', text: 'text-amber-800', bg: 'bg-amber-100' },
  [OrderStatus.ACCEPTED]: { label: 'Đã nhận', text: 'text-blue-800', bg: 'bg-blue-100' },
  [OrderStatus.PREPARING]: { label: 'Đang chuẩn bị', text: 'text-indigo-800', bg: 'bg-indigo-100' },
  [OrderStatus.READY]: { label: 'Sẵn sàng', text: 'text-green-800', bg: 'bg-green-100' },
  [OrderStatus.SERVED]: { label: 'Đã phục vụ', text: 'text-slate-800', bg: 'bg-slate-200' },
  [OrderStatus.COMPLETED]: { label: 'Hoàn thành', text: 'text-slate-800', bg: 'bg-slate-200' },
  [OrderStatus.REJECTED]: { label: 'Đã từ chối', text: 'text-red-800', bg: 'bg-red-100' },
  [OrderStatus.CANCELLED]: { label: 'Đã hủy', text: 'text-red-800', bg: 'bg-red-100' },
};


const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const { label, text, bg } = statusStyles[status] || { label: 'Không rõ', text: 'text-gray-800', bg: 'bg-gray-200' };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

export default OrderStatusBadge;
