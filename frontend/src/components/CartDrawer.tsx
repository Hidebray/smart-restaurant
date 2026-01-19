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

import { ShoppingCart, X, Trash2, Rocket, ScanLine, Info } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, tableId }: CartDrawerProps) {
  const { items, totalAmount, removeFromCart, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

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
        notes: notes.trim() || undefined,
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
      setNotes(""); // Reset notes
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
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            Giỏ hàng ({items.length} món)
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Danh sách món */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 mt-10 flex flex-col items-center">
              <ShoppingCart className="w-16 h-16 mb-4 stroke-1 text-slate-300" />
              <p>Chưa có món nào.</p>
              <button onClick={onClose} className="text-orange-600 mt-2 font-medium hover:underline">Xem Menu ngay</button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                {/* Ảnh nhỏ */}
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
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
                    <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                    <span className="text-orange-600 font-bold text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>

                  {/* Liệt kê modifiers (Topping/Size) */}
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.modifiers && item.modifiers.length > 0 ? item.modifiers.map(m => m.name).join(", ") : ""}
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <span className="text-sm font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      x{item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 p-1 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
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
              <span className="text-slate-600">Tổng cộng:</span>
              <span className="text-2xl font-bold text-orange-600">{formatPrice(totalAmount)}</span>
            </div>

            {/* Order Notes Input */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú đặc biệt (tùy chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Ít cay, không hành, giao nhanh..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {notes.length}/500
              </div>
            </div>

            {!tableId && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded flex items-center gap-2">
                <Info className="w-4 h-4" />
                Lưu ý: Chưa tìm thấy mã bàn. Vui lòng quét mã QR bàn trước khi gửi đơn.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !tableId}
              className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-orange-200"
            >
              {isSubmitting ? (
                <>Đang gửi...</>
              ) : (
                <>
                  {tableId ? <Rocket className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
                  {tableId ? 'Gửi Đơn Bếp' : 'Quét QR để đặt món'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
