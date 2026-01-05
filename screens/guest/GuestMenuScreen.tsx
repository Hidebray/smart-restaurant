
import React, { useState, useMemo, useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';
import { useSocket } from '../../context/SocketContext';
import { useToastStore } from '../../store/useToastStore';
import { categories, tables } from '../../data/mockData';
import { OrderStatus } from '../../types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { ShoppingCart, LogOut, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const GuestMenuScreen: React.FC = () => {
  const { tableId, logout } = useUserStore();
  const { totalItems } = useCartStore();
  const { products } = useProductStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { socket } = useSocket();
  const { showToast } = useToastStore();

  const table = useMemo(() => tables.find((t) => t.id === tableId), [tableId]);

  // Effect for handling real-time order status updates
  useEffect(() => {
    if (!socket || !tableId) return;

    // Join a room specific to this table to receive updates
    socket.emit('JOIN_ROOM', `table_${tableId}`);

    const handleStatusUpdate = (payload: { orderId: string, status: OrderStatus }) => {
        let message = '';
        switch (payload.status) {
            case OrderStatus.ACCEPTED:
                message = 'Nhà hàng đã nhận đơn hàng của bạn!';
                break;
            case OrderStatus.PREPARING:
                message = 'Bếp đã bắt đầu chuẩn bị đơn hàng của bạn!';
                break;
            case OrderStatus.READY:
                message = '🎉 Món ăn của bạn đã sẵn sàng! Nhân viên sẽ mang ra ngay.';
                break;
            default:
                return; // Ignore other statuses for now
        }
        showToast(message);
    };

    socket.on('ORDER_STATUS_UPDATED', handleStatusUpdate);

    return () => {
        socket.off('ORDER_STATUS_UPDATED', handleStatusUpdate);
    };
  }, [socket, tableId, showToast]);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchTerm, products]);

  if (!table) {
    return (
      <div className="flex items-center justify-center h-screen">
        Bàn không tồn tại. Vui lòng quay lại.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-md z-20 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-primary">Thực đơn</h1>
              <p className="text-gray-600">Bàn số: <span className="font-bold">{table.tableNumber}</span></p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
                aria-label={`View cart with ${totalItems} items`}
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text"
              placeholder="Tìm kiếm món ăn..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for dishes"
            />
          </div>

          <nav className="mt-4 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
               <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedCategoryId === 'all'
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
         {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
         ) : (
            <div className="text-center py-16">
                <p className="text-gray-500">Không tìm thấy món ăn phù hợp.</p>
            </div>
         )}
      </main>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default GuestMenuScreen;
