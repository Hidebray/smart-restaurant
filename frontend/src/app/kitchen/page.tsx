"use client";

import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu đơn giản cho Order
interface Order {
  id: string;
  table: { tableNumber: string };
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: { name: string };
  }[];
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải danh sách đơn
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải đơn:", error);
    }
  };

  // Tự động tải lại sau mỗi 5 giây (Polling đơn giản thay cho Socket)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    // Setup socket to receive orders when waiter sends to kitchen
    let socket: any = null;
    import('socket.io-client')
      .then(({ io }) => {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

        socket.on('connect', () => {
          console.log('Kitchen socket connected', socket.id);
          socket.emit('join', 'kitchen');
        });

        socket.on('order_to_kitchen', (order: Order) => {
          // new order sent to kitchen
          setOrders((prev) => [order, ...prev]);
        });

        socket.on('order_updated', (order: Order) => {
          setOrders((prev) => {
            const idx = prev.findIndex((o) => o.id === order.id);
            if (idx > -1) {
              const copy = [...prev];
              copy[idx] = order;
              return copy;
            }
            return [order, ...prev];
          });
        });
      })
      .catch((err) => console.error('Socket import error', err));

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, []);

  // Hàm lọc đơn theo trạng thái
  const getOrdersByStatus = (status: string) => {
    return orders.filter((o) => o.status === status);
  };

  // Hàm đổi trạng thái (VD: Bấm "Nấu" -> Chuyển sang PREPARING)
  // (Chúng ta sẽ làm API cập nhật sau, giờ cứ để hàm trống)
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      // 1. Gọi API
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // 2. Refresh lại danh sách ngay lập tức để thấy sự thay đổi
      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  if (loading) return <div className="p-8 text-center">⏳ Đang tải dữ liệu bếp...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🍳 Màn hình Bếp</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Tự động cập nhật mỗi 5s</div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CỘT 1: ĐƠN MỚI (ACCEPTED) - hiển thị sau khi Waiter chấp nhận */}
        <Column
          title="🔔 Đơn Đã Duyệt"
          orders={getOrdersByStatus("ACCEPTED")}
          color="bg-yellow-100 border-yellow-300"
          icon="🕒"
          onStatusChange={updateStatus}
        />

        {/* CỘT 2: ĐANG NẤU (PREPARING) */}
        <Column
          title="🔥 Đang Nấu"
          orders={getOrdersByStatus("PREPARING")}
          color="bg-blue-100 border-blue-300"
          icon="🍳"
          onStatusChange={updateStatus}
        />

        {/* CỘT 3: ĐÃ XONG (READY) */}
        <Column
          title="✅ Trả Món"
          orders={getOrdersByStatus("READY")}
          color="bg-green-100 border-green-300"
          icon="🛎️"
          onStatusChange={updateStatus}
        />

      </div>
    </main>
  );
}

// Component hiển thị cột (Để code gọn hơn)
function Column({ title, orders, color, icon, onStatusChange }: any) {
  return (
    <div className={`p-4 rounded-xl border-t-4 shadow-sm min-h-[500px] bg-white ${color}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <span>{icon}</span> {title}
        <span className="ml-auto bg-white px-2 py-1 rounded text-sm shadow-sm text-gray-900">{orders.length}</span>
      </h2>

      <div className="space-y-4">
        {orders.map((order: Order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2 pb-2 border-b border-dashed">
              <span className="font-bold text-lg text-blue-600">Bàn {order.table?.tableNumber || "?"}</span>
              <span className="text-xs text-gray-600">
                {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <ul className="space-y-2 mb-4">
              {order.items.map((item) => {
                const modNames = (item as any).modifiers?.map((m: any) => m.modifierOption?.name ?? m.name).filter(Boolean) ?? [];
                return (
                  <li key={item.id} className="text-gray-700">
                    <div className="flex justify-between">
                      <span>{item.product?.name ?? 'Unknown item'}</span>
                      <span className="font-bold">x{item.quantity}</span>
                    </div>
                    {modNames.length > 0 && (
                      <div className="text-xs text-gray-600 ml-1 mt-1">{modNames.join(', ')}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Nút thao tác nhanh (Mockup) */}
            <div className="flex gap-2">
              {order.status === 'ACCEPTED' && (
                <button
                  onClick={() => onStatusChange(order.id, 'PREPARING')}
                  className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm"
                >
                  👨‍🍳 Nhận Nấu
                </button>
              )}

              {order.status === 'PREPARING' && (
                <button
                  onClick={() => onStatusChange(order.id, 'READY')}
                  className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold transition-colors shadow-sm"
                >
                  ✅ Nấu Xong
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}