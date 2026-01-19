"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import OrderTimer from "@/components/OrderTimer";

// Định nghĩa kiểu dữ liệu
interface Order {
  id: string;
  table: { tableNumber: string };
  status: string;
  createdAt: string;
  notes?: string;
  items: {
    id: string;
    quantity: number;
    product: { name: string };
    status: string;
    modifiers?: { name?: string; modifierOption?: { name: string } }[];
  }[];
}

export default function KitchenPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // --- API & Socket Logic (Giữ nguyên) ---
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

  const playNotification = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Bell-like sound (Ding!)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    fetchOrders();

    let socket: any = null;
    import('socket.io-client')
      .then(({ io }) => {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
        socket.on('connect', () => {
          console.log('Kitchen socket connected', socket.id);
          socket.emit('join', 'kitchen');
        });
        socket.on('order_to_kitchen', (order: Order) => {
          playNotification();
          setOrders((prev) => {
            if (prev.some(o => o.id === order.id)) return prev;
            return [order, ...prev];
          });
        });
        socket.on('order_updated', (order: Order) => {
          // Optional: play sound on update? Maybe a different one?
          // For now, let's just make sound on NEW orders.
          setOrders((prev) => {
            const idx = prev.findIndex((o) => o.id === order.id);
            if (idx > -1) {
              const copy = [...prev];
              copy[idx] = order;
              return copy;
            }
            return prev;
          });
        });
      })
      .catch((err) => console.error('Socket import error', err));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  const updateItemStatus = async (itemId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/orders/items/${itemId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật món:", error);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-medium animate-pulse">{t('common.loading')}</div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* --- Sticky Header --- */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
            KDS <span className="text-orange-600">Smart Kitchen</span>
          </h1>
          <p className="text-sm text-slate-400 font-semibold tracking-wider uppercase mt-1">{t('kitchen.title')}</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all uppercase tracking-wide"
          >
            {t('common.logout')}
          </button>
        </div>
      </header>

      {/* --- Kanban Board --- */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

          {/* Column 1: APPROVED */}
          <OrderColumn
            title={t('kitchen.newOrders')}
            count={getOrdersByStatus("ACCEPTED").length}
            orders={getOrdersByStatus("ACCEPTED")}
            bgColor="bg-orange-50/50"
            borderColor="border-orange-200"
            titleColor="text-orange-700"
            updateStatus={updateStatus}
            updateItemStatus={updateItemStatus}
            actionType="COOK"
          />

          {/* Column 2: COOKING */}
          <OrderColumn
            title={t('kitchen.preparing')}
            count={getOrdersByStatus("PREPARING").length}
            orders={getOrdersByStatus("PREPARING")}
            bgColor="bg-blue-50/50"
            borderColor="border-blue-200"
            titleColor="text-blue-700"
            updateStatus={updateStatus}
            updateItemStatus={updateItemStatus}
            actionType="READY"
          />

          {/* Column 3: READY */}
          <OrderColumn
            title={t('kitchen.ready')}
            count={getOrdersByStatus("READY").length}
            orders={getOrdersByStatus("READY")}
            bgColor="bg-green-50/50"
            borderColor="border-green-200"
            titleColor="text-green-700"
            updateStatus={updateStatus}
            updateItemStatus={updateItemStatus}
            actionType="DONE"
          />
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function OrderColumn({ title, count, orders, bgColor, borderColor, titleColor, updateStatus, updateItemStatus, actionType }: any) {
  return (
    <div className={`flex flex-col h-full rounded-2xl border-2 ${borderColor} ${bgColor} overflow-hidden shadow-sm`}>
      {/* Column Header */}
      <div className="p-5 border-b border-gray-100/50 flex justify-between items-center bg-white/50 backdrop-blur-sm shrink-0">
        <h2 className={`font-black tracking-tight text-2xl uppercase ${titleColor}`}>{title}</h2>
        <span className={`px-4 py-1.5 rounded-full text-lg font-bold bg-white shadow-sm ring-1 ring-inset ring-gray-200 ${titleColor}`}>
          {count}
        </span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {orders.map((order: Order) => (
          <OrderCard
            key={order.id}
            order={order}
            updateStatus={updateStatus}
            updateItemStatus={updateItemStatus}
            parentActionType={actionType}
          />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, updateStatus, updateItemStatus, parentActionType }: any) {
  const { t } = useI18n();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 group hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200">
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('kitchen.table') || 'Table'}</div>
          <div className="text-5xl font-black text-slate-800 leading-none">{order.table?.tableNumber || "?"}</div>
        </div>
        <div className="flex flex-col items-end">
          <OrderTimer startTime={order.createdAt} className="text-3xl font-bold font-mono text-slate-700" />
          <span className="text-sm text-slate-400 font-medium mt-1">
            {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Special Instructions / Notes */}
      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">
            {t('cart.specialInstructions') || 'Ghi chú đặc biệt'}
          </div>
          <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
            "{order.notes}"
          </p>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-3">
        {order.items.map((item: any) => {
          const modNames = item.modifiers?.map((m: any) => m.modifierOption?.name ?? m.name).filter(Boolean) ?? [];
          // Status styling
          let statusClass = "bg-slate-100 text-slate-500";
          if (item.status === 'PREPARING') statusClass = "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100";
          if (item.status === 'READY') statusClass = "bg-green-50 text-green-700 ring-1 ring-inset ring-green-100";

          return (
            <div key={item.id} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
              <div className="flex-1 pr-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-black text-slate-800 text-2xl">x{item.quantity}</span>
                  <span className="text-xl font-semibold text-slate-700 leading-snug">{item.product.name}</span>
                </div>
                {modNames.length > 0 && (
                  <div className="text-sm text-slate-500 mt-1 pl-8 italic leading-tight">
                    {modNames.join(', ')}
                  </div>
                )}
              </div>

              {/* Item Action */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wide ${statusClass}`}>
                  {item.status || 'PENDING'}
                </span>

                {/* Individual Item Buttons */}
                {(item.status === 'PENDING' || !item.status) && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'PREPARING')}
                    className="text-sm font-bold bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 uppercase tracking-wide shadow-sm"
                  >
                    {t('kitchen.cook') || 'Cook'}
                  </button>
                )}
                {item.status === 'PREPARING' && (
                  <button
                    onClick={() => updateItemStatus(item.id, 'READY')}
                    className="text-sm font-bold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 uppercase tracking-wide shadow-sm"
                  >
                    {t('kitchen.done') || 'Done'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer / Bulk Actions */}
      <div className="pt-4 mt-auto">
        {parentActionType === 'COOK' && (
          <button
            onClick={() => updateStatus(order.id, 'PREPARING')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            {t('kitchen.cookAll') || 'Cook Order'}
          </button>
        )}
        {parentActionType === 'READY' && (
          <button
            onClick={() => updateStatus(order.id, 'READY')}
            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl text-lg font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            {t('kitchen.readyAll') || 'Complete Order'}
          </button>
        )}
        {parentActionType === 'DONE' && (
          <div className="w-full py-4 bg-green-50 text-green-700 rounded-xl text-lg font-bold text-center uppercase border-2 border-green-100">
            {t('kitchen.servedAll') || 'Order Served'}
          </div>
        )}
      </div>
    </div>
  )
}