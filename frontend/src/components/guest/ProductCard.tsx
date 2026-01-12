// components/guest/ProductCard.tsx
'use client';

import React from 'react';
import { Product } from '@/types';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleQuickAdd = () => {
    // MVP: Tạm thời thêm 1 món với không có topping (rỗng [])
    // Sau này sẽ làm Modal chọn Size/Topping ở đây
    addToCart(product, 1, []);
    // Alert tạm để biết đã thêm
    // alert(`Đã thêm ${product.name} vào giỏ!`); 
  };

  // Lấy ảnh đầu tiên làm ảnh đại diện, nếu không có thì dùng ảnh placeholder
  const primaryImage = product.images.find(img => img.isPrimary)?.url || 'https://via.placeholder.com/300';

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <img 
          src={primaryImage} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.isChefRecommended && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-black shadow-sm">
            Best Seller
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{product.name}</h3>
          <span className="font-semibold text-orange-600 block shrink-0 ml-2">
            {Number(product.price).toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <button 
          onClick={handleQuickAdd}
          className="w-full bg-orange-50 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-100 flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Plus size={18} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}