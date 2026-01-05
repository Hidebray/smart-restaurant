
import React from 'react';
import { useCartStore } from '../../../store/useCartStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useUserStore } from '../../../store/useUserStore';
import { useToastStore } from '../../../store/useToastStore';
import { useSocket } from '../../../context/SocketContext';
import { tables } from '../../../data/mockData';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, updateQuantity, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { tableId } = useUserStore();
  const { showToast } = useToastStore();
  const { socket } = useSocket();

  const handlePlaceOrder = () => {
    if (!tableId) return;
    
    // Create a payload for the real-time notification
    if (socket) {
      const table = tables.find(t => t.id === tableId);
      const orderNotificationData = {
          tableId,
          tableNumber: table?.tableNumber || '?',
          items,
          totalPrice,
          createdAt: new Date().toISOString(),
      };
      socket.emit('NEW_ORDER', orderNotificationData);
    }

    addOrder(items, tableId, totalPrice);
    showToast('Đơn hàng của bạn đã được gửi đi!');
    clearCart();
    onClose();
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Giỏ hàng của bạn">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                 <div className="flex items-center border rounded-md">
                   <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100"><Minus size={14} /></button>
                   <span className="px-3 text-sm font-medium">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100"><Plus size={14} /></button>
                 </div>
                 <Button variant="ghost" size="icon" className="text-red-500" onClick={() => updateQuantity(item.id, 0)}>
                   <Trash2 size={18} />
                 </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Tổng cộng:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <Button size="lg" className="w-full mt-4" onClick={handlePlaceOrder}>
            Gửi đơn
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default Cart;
