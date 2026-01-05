
import React from 'react';
import { Product, ProductStatus } from '../../../types';
import { useCartStore } from '../../../store/useCartStore';
import { useToastStore } from '../../../store/useToastStore';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);
  const isAvailable = product.status === ProductStatus.AVAILABLE;

  const handleAddItem = () => {
    addItem(product);
    showToast(`Đã thêm "${product.name}"`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {!isAvailable && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <span className="text-white font-bold text-lg px-4 py-2 bg-red-600 rounded-md">Hết hàng</span>
           </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-brand-dark">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-extrabold text-brand-primary">{formatPrice(product.price)}</span>
          <Button size="sm" onClick={handleAddItem} disabled={!isAvailable}>
            <Plus className="h-4 w-4 mr-1" /> Thêm
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
