'use client';

import React, { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';

// Định nghĩa kiểu dữ liệu đơn giản cho UI Bếp
interface Order {
  id: string;
  table: { tableNumber: string };
  status: string;
  items: any[];
  createdAt: string;
  notes?: string;
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Load đơn hàng hiện có từ Database
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải đơn:', error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 2. KẾT NỐI SOCKET
    if (!socket.connected) socket.connect();
    
    // Báo danh: "Tôi là nhân viên"
    socket.emit("join-staff"); 

    // 3. LẮNG NGHE ĐƠN MỚI
    socket.on("new-order-received", (newOrder) => {
      // Phát âm thanh thông báo (Tùy chọn)
      const audio = new Audio('/notification.mp3'); // Bạn cần file mp3 trong public/
      audio.play().catch(() => {}); 
      
      // Thêm đơn mới vào cuối danh sách
      setOrders((prev) => [...prev, newOrder]);
    });

    // 4. LẮNG NGHE CẬP NHẬT TRẠNG THÁI (Để đồng bộ giữa các màn hình bếp)
    socket.on("status-changed", ({ orderId, status }) => {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status } : o
      ));
    });

    return () => {
      socket.off("new-order-received");
      socket.off("status-changed");
    };
  }, []);

  // Hàm xử lý chuyển trạng thái
  const updateStatus = async (orderId: string, currentStatus: string, tableId: string) => {
    let nextStatus = 'PREPARING';
    if (currentStatus === 'ACCEPTED') nextStatus = 'PREPARING'; // Nhận đơn -> Nấu
    else if (currentStatus === 'PREPARING') nextStatus = 'READY'; // Nấu xong -> Chờ bưng
    else if (currentStatus === 'READY') nextStatus = 'SERVED'; // Đã bưng
    else return;

    // 1. Gọi API cập nhật DB
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: nextStatus })
    });

    // 2. Bắn Socket báo cho mọi người biết
    socket.emit("update-order-status", { orderId, tableId, status: nextStatus });
  };

  if (loading) return <div className="p-10 text-center">Đang tải KDS...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ChefHat className="text-orange-500" size={32} />
          Bếp / KDS
        </h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">Đơn chờ: </span>
          <span className="text-orange-500 font-bold text-xl">{orders.filter(o => o.status !== 'SERVED').length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">
            Chưa có đơn hàng nào, hãy nghỉ ngơi! ☕
          </div>
        ) : (
          orders
          .filter(o => ['ACCEPTED', 'PREPARING', 'READY'].includes(o.status))
          .map((order) => (
            <div 
              key={order.id} 
              className={`rounded-xl border-l-4 p-4 shadow-lg flex flex-col h-full transition-all ${
                order.status === 'ACCEPTED' ? 'bg-gray-800 border-red-500 animate-pulse-slow' :
                order.status === 'PREPARING' ? 'bg-gray-800 border-yellow-500' :
                order.status === 'READY' ? 'bg-gray-800 border-green-500' :
                'bg-gray-800 border-gray-600 opacity-50'
              }`}
            >
              {/* Header Card */}
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-700">
                <div>
                  <h3 className="font-bold text-xl text-white">Bàn {order.table.tableNumber}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                   order.status === 'ACCEPTED' ? 'bg-red-900 text-red-200' :
                   order.status === 'PREPARING' ? 'bg-yellow-900 text-yellow-200' :
                   order.status === 'READY' ? 'bg-green-900 text-green-200' : 'bg-gray-700'
                }`}>
                  {order.status === 'ACCEPTED' ? 'CHỜ DUYỆT' :
                   order.status === 'PREPARING' ? 'ĐANG NẤU' :
                   order.status === 'READY' ? 'SẴN SÀNG' : order.status}
                </span>
              </div>

              {/* Items List */}
              <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-60">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-200">{item.quantity} x {item.product.name}</span>
                    </div>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-gray-400 text-xs pl-4 italic">
                        + {item.modifiers.map((m: any) => m.modifierOption.name).join(', ')}
                      </p>
                    )}
                    {item.notes && <p className="text-yellow-500 text-xs pl-4">Note: {item.notes}</p>}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-4 border-t border-gray-700">
                {order.status === 'ACCEPTED' && (
                  <button 
                    onClick={() => updateStatus(order.id, order.status, order.table.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors"
                  >
                    NHẬN ĐƠN & NẤU
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button 
                    onClick={() => updateStatus(order.id, order.status, order.table.id)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold transition-colors"
                  >
                    XONG -&gt; TRẢ MÓN
                  </button>
                )}
                {order.status === 'READY' && (
                  <div className="text-center text-green-500 font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> ĐÃ SẴN SÀNG
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}