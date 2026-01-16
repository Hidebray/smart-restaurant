"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "@/lib/api/orders";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string | null;
}

export default function CartDrawer({ isOpen, onClose, tableId }: CartDrawerProps) {
  const { items, totalAmount, removeFromCart, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format tiền
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Hàm xử lý Đặt hàng (Gọi API Backend)
  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!tableId) {
      toast.error("Lỗi: Không tìm thấy mã bàn. Vui lòng quét lại mã QR.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Chuẩn bị dữ liệu gửi lên Backend
      const orderData = {
        tableId: tableId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          modifiers: (item.modifiers && item.modifiers.length > 0)
            ? item.modifiers.map(m => ({ modifierOptionId: m.modifierOptionId }))
            : [],
        }))
      };

      // 2. Gọi API
      await ordersApi.create(orderData);
      
      // 3. Thành công
      toast.success("🎉 Đặt món thành công! Bếp đang chuẩn bị.");
      clearCart(); // Xóa giỏ
      onClose();   // Đóng Drawer

    } catch (error: any) {
      console.error(error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Màn đen mờ che background */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel trượt từ phải sang */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Giỏ hàng ({items.length} món)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">✕</button>
        </div>

        {/* Body: Danh sách món */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-600 mt-10 flex flex-col items-center">
              <span className="text-4xl mb-2">🛒</span>
              <p>Chưa có món nào.</p>
              <button onClick={onClose} className="text-blue-600 mt-2 font-medium">Xem Menu ngay</button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                {/* Ảnh nhỏ */}
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                    <span className="text-blue-600 font-bold text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>

                  {/* Liệt kê modifiers (Topping/Size) */}
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.modifiers && item.modifiers.length > 0 ? item.modifiers.map(m => m.name).join(", ") : ""}
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      x{item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 text-xs font-medium hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Tổng tiền & Nút chốt đơn */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white safe-area-pb">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Tổng cộng:</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(totalAmount)}</span>
            </div>

            {!tableId && (
              <div className="mb-3 text-sm text-red-600">Lưu ý: Chưa tìm thấy mã bàn. Vui lòng quét mã QR bàn trước khi gửi đơn.</div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !tableId}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>Wait...</>
              ) : (
                <>{tableId ? '🚀 Gửi Đơn Bếp' : 'Quét QR để đặt món'}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}