// [File: frontend/app/waiter/page.tsx]
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  table: { tableNumber: string };
  status: string;
  createdAt: string;
  totalAmount: number;
  items: {
    id: string;
    quantity: number;
    product: { name: string };
  }[];
}

export default function WaiterPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Tải đơn hàng (Chỉ lấy đơn nào có món đã xong hoặc đang ăn)
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/orders");
      const data = await res.json();
      // Waiter quan tâm nhất là đơn READY (để bưng) và SERVED (để tính tiền)
      const waiterOrders = data.filter((o: Order) => 
        o.status === 'READY' || o.status === 'SERVED'
      );
      setOrders(waiterOrders);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling 5s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(newStatus === 'SERVED' ? "Đã bưng món ra bàn! 🏃" : "Đã thanh toán xong! 💰");
      fetchOrders();
    } catch (error) {
      toast.error("Lỗi cập nhật");
    }
  };

  // Tách ra 2 nhóm: Cần bưng (Ready) và Đang ăn (Served)
  const readyOrders = orders.filter(o => o.status === 'READY');
  const servedOrders = orders.filter(o => o.status === 'SERVED');

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🤵 Màn hình Phục Vụ</h1>
        <div className="flex gap-2 text-sm font-bold">
           <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
             Cần bưng: {readyOrders.length}
           </span>
           <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
             Đang ăn: {servedOrders.length}
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CỘT 1: MÓN ĐÃ XONG - CẦN BƯNG NGAY */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-green-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
            🔔 Món Chờ Bưng (Ready)
          </h2>
          <div className="space-y-4">
            {readyOrders.length === 0 && <p className="text-gray-400 italic text-center">Không có món nào chờ.</p>}
            
            {readyOrders.map((order) => (
              <div key={order.id} className="border border-green-200 bg-green-50 p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-green-800">Bàn {order.table.tableNumber}</span>
                    <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                </div>
                <ul className="mb-4 bg-white p-2 rounded border border-green-100">
                    {order.items.map(item => (
                        <li key={item.id} className="font-medium text-gray-800">
                            • {item.quantity} x {item.product.name}
                        </li>
                    ))}
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

        {/* CỘT 2: KHÁCH ĐANG ĂN - CHỜ THANH TOÁN */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-blue-500 min-h-[500px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
            🍽️ Đang Ăn (Served)
          </h2>
          <div className="space-y-4">
            {servedOrders.map((order) => (
               <div key={order.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-gray-700">Bàn {order.table.tableNumber}</span>
                    <span className="text-blue-600 font-bold">
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(Number(order.totalAmount))}
                    </span>
                </div>
                <div className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {order.items.map(i => i.product.name).join(", ")}
                </div>
                <button 
                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded text-sm"
                >
                    💰 Thanh Toán & Dọn Bàn
                </button>
               </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}