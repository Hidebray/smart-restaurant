// [File: frontend/app/waiter/page.tsx]
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BillModal from "@/components/waiter/BillModal";
import { Order } from "@/types";

// Extended Order type to include table info if not fully covered in @/types for this specific view
// Assuming @/types Order does not have `table` object populated fully in the frontend types yet based on previous file view
// However, the previous view showed `table` as part of Order in `waiter/page.tsx`'s local interface. 
// We should check if the API returns the table object. The local interface had: table: { tableNumber: string }.
// The imported Order type has `tableId: string`. 
// We must intersect the type or extend it to match what the API actually returns (which includes relations).
interface OrderWithRelations extends Order {
  table: { tableNumber: string };
  items: (Order['items'][0] & {
    product: { name: string };
    modifiers?: { name?: string; modifierOption?: { name: string } }[];
  })[];
}

export default function WaiterPage() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Tải đơn hàng (Chỉ lấy đơn nào có món đã xong hoặc đang ăn)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders`);
      const data = await res.json();
      // Keep all orders; we'll filter into groups in the UI
      setOrders(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Setup socket.io client for reall-time notifications
    let socket: any = null;
    import('socket.io-client').then(({ io }) => {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');

      socket.on('connect', () => {
        console.log('Waiter socket connected', socket.id);
        socket.emit('join', 'waiter');
      });

      socket.on('new_order', (order: OrderWithRelations) => {
        setOrders((prev) => {
          if (prev.some(o => o.id === order.id)) return prev;
          setTimeout(() => toast.success('Đơn hàng mới đã đến!'), 0);
          return [order, ...prev];
        });
      });

      socket.on('order_updated', (order: OrderWithRelations) => {
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === order.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = order;
            return copy;
          }
          // Optionally handle adding if not found, but typically updates are for existing
          return prev; // Or [order, ...prev] if you want to add updates that weren't there
        });
      });
    }).catch(err => console.error('Socket import error', err));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const messages: Record<string, string> = {
        SERVED: "Đã bưng món ra bàn! 🏃",
        COMPLETED: "Đã thanh toán xong! 💰",
        ACCEPTED: "Đơn đã được chấp nhận.",
        REJECTED: "Đơn đã bị từ chối.",
        PREPARING: "Bếp bắt đầu chuẩn bị.",
        READY: "Món đã sẵn sàng.",
      };
      toast.success(messages[newStatus] ?? "Cập nhật trạng thái");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi cập nhật");
    }
  };

  const handleOpenBill = (order: OrderWithRelations) => {
    setSelectedOrder(order);
    setIsBillModalOpen(true);
  };

  // Tách ra 2 nhóm: Cần bưng (Ready) và Đang ăn (Served)
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const servedOrders = orders.filter(o => o.status === 'SERVED');

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🤵 Màn hình Phục Vụ</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-sm font-bold">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Cần bưng: {readyOrders.length}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Đang ăn: {servedOrders.length}
            </span>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* CỘT 1: ĐƠN MỚI - CHỜ PHÊ DUYỆT */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-yellow-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-700">
            🕒 Đơn Mới (Pending)
          </h2>
          <div className="space-y-4">
            {pendingOrders.length === 0 && <p className="text-gray-500 italic text-center">Không có đơn chờ.</p>}

            {pendingOrders.map((order) => (
              <div key={order.id} className="border border-yellow-200 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-yellow-800">Bàn {order.table?.tableNumber ?? "?"}</span>
                  <span className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                </div>
                <ul className="mb-4 bg-white p-2 rounded border border-yellow-100">
                  {order.items.map((item) => {
                    const modNames = item.modifiers?.map((m: any) => m.modifierOption?.name ?? m.name).filter(Boolean) ?? [];
                    return (
                      <li key={item.id} className="font-medium text-gray-800">
                        <div>• {item.quantity} x {item.product?.name ?? 'Unknown item'}</div>
                        {modNames.length > 0 && (
                          <div className="text-xs text-gray-600 ml-4 mt-1">{modNames.join(', ')}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(order.id, 'ACCEPTED')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                  >
                    ✅ Chấp Nhận
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'REJECTED')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded"
                  >
                    ❌ Từ Chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT 2: MÓN ĐÃ XONG - CẦN BƯNG NGAY */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-green-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
            🔔 Món Chờ Bưng (Ready)
          </h2>
          <div className="space-y-4">
            {readyOrders.length === 0 && <p className="text-gray-500 italic text-center">Không có món nào chờ.</p>}

            {readyOrders.map((order) => (
              <div key={order.id} className="border border-green-200 bg-green-50 p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-800">Bàn {order.table?.tableNumber ?? "?"}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                <ul className="mb-4 bg-white p-2 rounded border border-green-100">
                  {order.items.map((item) => {
                    const modNames = item.modifiers?.map((m: any) => m.modifierOption?.name ?? m.name).filter(Boolean) ?? [];
                    return (
                      <li key={item.id} className="font-medium text-gray-800">
                        <div>• {item.quantity} x {item.product?.name ?? 'Unknown item'}</div>
                        {modNames.length > 0 && (
                          <div className="text-xs text-gray-600 ml-4 mt-1">{modNames.join(', ')}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <button
                  onClick={() => updateStatus(order.id, 'SERVED')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  🏃 Bưng Ra Bàn Ngay
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT 3: KHÁCH ĐANG ĂN - CHỜ THANH TOÁN */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-blue-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
            🍽️ Đang Ăn (Served)
          </h2>
          <div className="space-y-4">
            {servedOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-gray-900">Bàn {order.table.tableNumber}</span>
                  <span className="text-blue-600 font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.totalAmount))}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {order.items.map(i => {
                    const mods = i.modifiers?.map((m: any) => m.modifierOption?.name ?? m.name).filter(Boolean) ?? [];
                    return mods.length ? `${i.product?.name ?? 'Unknown'} (${mods.join(', ')})` : (i.product?.name ?? 'Unknown');
                  }).join(", ")}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenBill(order)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm"
                  >
                    🧾 Xem Hóa Đơn Tạm
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded text-sm"
                  >
                    💰 Thanh Toán & Dọn Bàn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        order={selectedOrder}
        tableNumber={selectedOrder?.table.tableNumber ?? "?"}
      />
    </main>
  );
}
