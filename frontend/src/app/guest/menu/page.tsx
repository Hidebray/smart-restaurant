'use client';

import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/guest/ProductCard';
import CartDrawer from '@/components/guest/CartDrawer'; // Import mới
import { ShoppingCart, Utensils, Search } from 'lucide-react';
import { socket } from '@/lib/socket';

export default function GuestMenuPage() {
  const { products, categories, fetchProducts, isLoading } = useProductStore();
  const { items } = useCartStore();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false); // State mở giỏ hàng
  
  // State lưu thông tin bàn (Lấy tạm bàn đầu tiên để demo)
  const [tableInfo, setTableInfo] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    fetchProducts();
    
    // Lấy danh sách bàn để giả lập việc login vào một bàn cụ thể
    // Thực tế sẽ lấy từ URL ?token=... hoặc LocalStorage
    fetch('/api/tables')
      .then(res => res.json())
      .then(tables => {
        if (tables.length > 0) {
          setTableInfo({ id: tables[0].id, name: tables[0].tableNumber });
        }
      });
  }, [fetchProducts]);

  useEffect(() => {
    if (categories.length > 0 && activeCategory === 'all') {
      setActiveCategory(categories[0].id);
    }
  }, [categories]);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  useEffect(() => {
    // 1. Kết nối socket
    socket.connect();

    // 2. Khi có thông tin bàn -> Join vào room của bàn đó
    if (tableInfo) {
      socket.emit("join-table", tableInfo.id);
    }

    // 3. Lắng nghe sự kiện: Món ăn thay đổi trạng thái (Bếp làm xong)
    socket.on("status-changed", (data) => {
      // Ví dụ: Hiện thông báo Toast (MVP dùng alert cho nhanh)
      console.log("Cập nhật món:", data);
      // alert(`Món của bạn đang chuyển sang trạng thái: ${data.status}`);
    });

    // Cleanup khi thoát trang
    return () => {
      socket.off("status-changed");
      socket.disconnect();
    };
  }, [tableInfo]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg shadow-sm">
              <Utensils className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800 leading-tight">Smart Restaurant</h1>
              {/* Hiển thị tên bàn thật */}
              <p className="text-xs text-gray-500">{tableInfo ? `Bàn ${tableInfo.name}` : 'Đang chọn bàn...'}</p>
            </div>
          </div>
          
          <div 
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsCartOpen(true)} // Mở giỏ hàng khi click
          >
            <div className="p-2 bg-orange-50 rounded-full text-orange-600">
              <ShoppingCart size={24} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                  {items.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thanh danh mục (Giữ nguyên) */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content (Giữ nguyên) */}
      <main className="p-4 container mx-auto max-w-5xl">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Chưa có món ăn nào</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Component Giỏ Hàng */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        tableId={tableInfo?.id || ''} // Truyền Table ID xuống
      />
    </div>
  );
}