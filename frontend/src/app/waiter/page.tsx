// [File: frontend/app/waiter/page.tsx]
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BillModal from "@/components/waiter/BillModal";
import OrderTimer from "@/components/OrderTimer";
import { Order } from "@/types";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { tablesApi, Table } from "@/lib/api/tables";
import { api } from "@/lib/api/api";

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
  const { t } = useI18n();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [assignedTables, setAssignedTables] = useState<Table[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);

  // Tải đơn hàng (Chỉ lấy đơn nào có món đã xong hoặc đang ăn)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders`);
      const result = await res.json();
      setOrders(result ?? []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up polling every 5s
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch current user profile to get user ID
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setCurrentUserId(res.data.id);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (currentUserId && showTables) {
      const fetchAssignedTables = async () => {
        try {
          const tables = await tablesApi.getAssignedTables(currentUserId);
          setAssignedTables(tables);
        } catch (error) {
          console.error('Failed to fetch assigned tables:', error);
        }
      };
      fetchAssignedTables();
    }
  }, [currentUserId, showTables]);

  useEffect(() => {
    // Socket.IO: Listen for order updates from Kitchen
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    const socketModule = import('socket.io-client').then((mod) => {
      const socket = mod.io(socketUrl, {
        transports: ['websocket', 'polling'],
      });

      // Join 'waiter' room
      socket.emit('join_role', 'waiter');

      // Listen for new orders or order status changes
      socket.on('new_order', () => {
        toast('🔔 Đơn mới vừa tới!', {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#f59e0b',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '1rem',
          },
          icon: '📋',
        });
        fetchOrders();
      });

      socket.on('order_updated_to_kitchen', () => {
        fetchOrders();
      });

      socket.on('table_notification', (data: any) => {
        const msg = data.type === 'PAYMENT_CASH' ? 'gọi thanh toán tiền mặt!'
          : data.type === 'PAYMENT_QR' ? 'gọi thanh toán QR!'
            : 'cần hỗ trợ!';
        toast(`🔔 Bàn ${data.tableName} ${msg}`, {
          duration: 10000,
          position: 'top-center',
          style: {
            background: '#e74c3c',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '1.2rem',
          },
          icon: '🏃',
        });
      });

      return () => {
        socket.disconnect();
      };
    });

    // Cleanup
    return () => {
      socketModule.then((cleanup) => cleanup && cleanup());
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

  const handleOrderUpdated = (updated: OrderWithRelations) => {
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
    fetchOrders();
  };

  // Tách ra 2 nhóm: Cần bưng (Ready) và Đang ăn (Served)
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const servedOrders = orders.filter(o => o.status === 'SERVED');

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🤵 {t('waiter.title')}</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-sm font-bold">
            <span className="bg-green-100 text-green-900 border border-green-300 px-3 py-1 rounded-full">
              {t('waiter.readyToServe')}: {readyOrders.length}
            </span>
            <span className="bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full">
              {t('waiter.currentlyServing')}: {servedOrders.length}
            </span>
            <span className="bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1 rounded-full">
              Bàn của tôi: {assignedTables.length}
            </span>
          </div>
          <button
            onClick={() => setShowTables(!showTables)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              showTables
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {showTables ? 'Ẩn Bàn' : 'Xem Bàn Của Tôi'}
          </button>
          <LanguageSwitcher />
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

      {/* Assigned Tables Section */}
      {showTables && (
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700">
            🪑 Bàn Được Phân Công Cho Tôi
          </h2>
          {assignedTables.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              Bạn chưa được phân công bàn nào. Vui lòng liên hệ Admin để được phân công.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {assignedTables.map((table) => (
                <div
                  key={table.id}
                  className={`p-4 rounded-lg border-2 ${
                    table.status === 'OCCUPIED'
                      ? 'border-red-300 bg-red-50'
                      : table.status === 'RESERVED'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">Bàn {table.tableNumber}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {table.capacity} chỗ
                      {table.location && ` • ${table.location}`}
                    </div>
                    <div className="text-xs font-semibold mt-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          table.status === 'OCCUPIED'
                            ? 'bg-red-200 text-red-800'
                            : table.status === 'RESERVED'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {table.status === 'OCCUPIED'
                          ? 'Đang dùng'
                          : table.status === 'RESERVED'
                          ? 'Đã đặt'
                          : 'Trống'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* CỘT 1: ĐƠN MỚI - CHỜ PHÊ DUYỆT */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-yellow-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-800">
            🕒 Đơn Mới (Pending)
          </h2>
          <div className="space-y-4">
            {pendingOrders.length === 0 && <p className="text-gray-500 italic text-center">Không có đơn chờ.</p>}

            {pendingOrders.map((order) => (
              <div key={order.id} className="border border-yellow-200 bg-yellow-50/30 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-yellow-900">Bàn {order.table?.tableNumber ?? "?"}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                    <OrderTimer startTime={order.createdAt} />
                  </div>
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800">
            🔔 Món Chờ Bưng (Ready)
          </h2>
          <div className="space-y-4">
            {readyOrders.length === 0 && <p className="text-gray-500 italic text-center">Không có món nào chờ.</p>}

            {readyOrders.map((order) => (
              <div key={order.id} className="border border-green-300 bg-green-50 p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-900">Bàn {order.table?.tableNumber ?? "?"}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                    <OrderTimer startTime={order.createdAt} />
                  </div>
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
        onOrderUpdated={handleOrderUpdated}
      />
    </main>
  );
}
