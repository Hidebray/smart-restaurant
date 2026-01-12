'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { X, Trash2, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { socket } from '@/lib/socket';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string; // Truyền ID bàn xuống để gửi đơn
}

export default function CartDrawer({ isOpen, onClose, tableId }: CartDrawerProps) {
  const { items, total, removeFromCart, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 1. Gửi API lưu vào Database (Code cũ giữ nguyên)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            modifiers: item.modifiers,
            notes: '' 
          })),
          note: 'Khách tự đặt qua QR'
        })
      });

      if (!response.ok) throw new Error('Đặt món thất bại');
      const newOrder = await response.json(); // Nhận order vừa tạo từ DB

      // 2. BẮN SOCKET (Code Mới) 🚀
      // Kết nối nếu chưa
      if (!socket.connected) socket.connect();
      
      // Gửi sự kiện 'new-order' kèm dữ liệu đơn hàng
      socket.emit("new-order", newOrder);

      // 3. Dọn dẹp
      clearCart();
      alert('🎉 Đặt món thành công! Bếp đã nhận được tin.');
      onClose();
      
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra, vui lòng gọi nhân viên!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay tối màu */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">Giỏ hàng ({items.length} món)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Body List Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Giỏ hàng đang trống</div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.productName}</h4>
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                  
                  {/* Hiển thị modifiers nếu có */}
                  {item.modifiers && item.modifiers.length > 0 && (
                     <div className="text-xs text-gray-400 mt-1">
                       {item.modifiers.map(m => `+ ${m.name}`).join(', ')}
                     </div>
                  )}
                  
                  <div className="text-orange-600 font-medium mt-1">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-400 p-2 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Tổng cộng</span>
            <span className="text-xl font-bold text-orange-600">{total.toLocaleString('vi-VN')}đ</span>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={items.length === 0 || isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
              items.length === 0 || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              <>
                Gửi Đơn Bếp
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}