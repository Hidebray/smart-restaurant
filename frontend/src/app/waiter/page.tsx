'use client';

import React, { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { User, Bell, CheckCircle, XCircle, DollarSign, Coffee } from 'lucide-react';

interface Order {
  id: string;
  table: { id: string, tableNumber: string };
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

export default function WaiterPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'READY' | 'ACTIVE'>('PENDING');

  // Load tất cả đơn hàng
  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    if (!socket.connected) socket.connect();
    socket.emit("join-staff");

    // Nghe sự kiện Realtime
    socket.on("new-order-received", (newOrder) => {
      // Alert nhẹ
      const audio = new Audio('/notification.mp3'); 
      audio.play().catch(() => {});
      setOrders(prev => [...prev, newOrder]);
    });

    socket.on("status-changed", ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    });

    return () => {
      socket.off("new-order-received");
      socket.off("status-changed");
    };
  }, []);

  // Hàm cập nhật trạng thái
  const handleStatusUpdate = async (orderId: string, newStatus: string, tableId: string) => {
    // Gọi API
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    });
    
    // Bắn Socket
    socket.emit("update-order-status", { orderId, tableId, status: newStatus });
  };

  // Lọc đơn hàng theo Tab
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  // Active là các đơn đã phục vụ nhưng chưa thanh toán
  const activeOrders = orders.filter(o => ['ACCEPTED', 'PREPARING', 'SERVED'].includes(o.status));

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <User /> Phục vụ
          </h1>
          <div className="text-sm text-gray-500">
            Ca làm việc: Sáng
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'
            }`}
          >
            <Bell size={18} />
            Chờ duyệt ({pendingOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('READY')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'READY' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600'
            }`}
          >
            <CheckCircle size={18} />
            Trả món ({readyOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'ACTIVE' ? 'bg-purple-600 text-white' : 'bg-white border text-gray-600'
            }`}
          >
            <Coffee size={18} />
            Đang phục vụ ({activeOrders.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        
        {/* VIEW 1: DUYỆT ĐƠN (PENDING) */}
        {activeTab === 'PENDING' && (
          pendingOrders.length === 0 ? <p className="text-center text-gray-500 mt-10">Không có đơn mới</p> :
          pendingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500 animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Bàn {order.table.tableNumber}</h3>
                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm flex justify-between">
                    <span>{item.quantity} x {item.product.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'REJECTED', order.table.id)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Từ chối
                </button>
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'ACCEPTED', order.table.id)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Chấp nhận
                </button>
              </div>
            </div>
          ))
        )}

        {/* VIEW 2: TRẢ MÓN (READY) */}
        {activeTab === 'READY' && (
          readyOrders.length === 0 ? <p className="text-center text-gray-500 mt-10">Bếp chưa nấu xong món nào</p> :
          readyOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Bàn {order.table.tableNumber}</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Món đã xong</span>
              </div>
              <div className="space-y-2 mb-4">
                 {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm font-medium">
                    • {item.quantity} x {item.product.name}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleStatusUpdate(order.id, 'SERVED', order.table.id)}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Đã mang ra bàn
              </button>
            </div>
          ))
        )}

        {/* VIEW 3: THANH TOÁN (ACTIVE) */}
        {activeTab === 'ACTIVE' && (
          activeOrders.length === 0 ? <p className="text-center text-gray-500 mt-10">Trống</p> :
          activeOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Bàn {order.table.tableNumber}</h3>
                <p className="text-sm text-gray-500">
                  Trạng thái: 
                  <span className={`ml-1 font-bold ${
                    order.status === 'ACCEPTED' ? 'text-blue-500' :
                    order.status === 'PREPARING' ? 'text-yellow-500' : 'text-purple-500'
                  }`}>
                    {order.status === 'ACCEPTED' ? 'Đợi bếp' :
                     order.status === 'PREPARING' ? 'Bếp đang nấu' : 'Khách đang ăn'}
                  </span>
                </p>
                <p className="font-bold text-orange-600 mt-1">
                  {Number(order.totalAmount).toLocaleString('vi-VN')}đ
                </p>
              </div>
              
              {/* Chỉ hiện nút thanh toán khi đã phục vụ xong */}
              {order.status === 'SERVED' && (
                <button 
                  onClick={() => {
                    if(confirm('Xác nhận khách đã thanh toán?')) {
                      handleStatusUpdate(order.id, 'COMPLETED', order.table.id);
                    }
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 flex flex-col items-center"
                >
                  <DollarSign size={20} />
                  <span className="text-xs">Thanh toán</span>
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}