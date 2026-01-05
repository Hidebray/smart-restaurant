
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';
import { useSocket } from '../../context/SocketContext';
import { Order, OrderStatus } from '../../types';
import Button from '../../components/ui/Button';
import { LogOut, Bell, ChefHat } from 'lucide-react';
import Card from '../../components/ui/Card';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const TimeAgo: React.FC<{ date: Date }> = ({ date }) => {
    const [timeString, setTimeString] = React.useState('');

    React.useEffect(() => {
        const update = () => {
            const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
            let interval = seconds / 60;
            if (interval < 60) {
                setTimeString(`${Math.floor(interval)} phút trước`);
            } else {
                 interval = seconds / 3600;
                 setTimeString(`${Math.floor(interval)} giờ trước`);
            }
        };
        update();
        const intervalId = setInterval(update, 60000);
        return () => clearInterval(intervalId);
    }, [date]);
    
    return <span className="text-xs text-gray-500">{timeString}</span>
}

const PendingOrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { updateOrderStatus } = useOrderStore();
  
  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">Bàn {order.tableNumber}</h3>
          <TimeAgo date={order.createdAt} />
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <ul className="pl-4 list-disc list-inside text-sm text-gray-600 space-y-1">
        {order.items.map(item => (
          <li key={item.productId}>
            <span className="font-semibold">{item.quantity}x</span> {item.name}
          </li>
        ))}
      </ul>
      <div className="border-t pt-3">
        <p className="font-bold text-right mb-3">Tổng: {formatPrice(order.totalPrice)}</p>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, OrderStatus.REJECTED)}>Từ chối</Button>
          <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, OrderStatus.ACCEPTED)}>Chấp nhận</Button>
        </div>
      </div>
    </Card>
  );
};

const ReadyOrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { updateOrderStatus } = useOrderStore();
  return (
     <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">Bàn {order.tableNumber}</h3>
          <p className="text-xs text-gray-500">Bếp đã hoàn thành</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
       <ul className="pl-4 list-disc list-inside text-sm text-gray-600 space-y-1">
        {order.items.map(item => (
          <li key={item.productId}>
            <span className="font-semibold">{item.quantity}x</span> {item.name}
          </li>
        ))}
      </ul>
      <div className="border-t pt-3">
        <Button className="w-full" onClick={() => updateOrderStatus(order.id, OrderStatus.SERVED)}>Đã phục vụ</Button>
      </div>
    </Card>
  );
};


const WaiterScreen: React.FC = () => {
    const logout = useUserStore((state) => state.logout);
    const orders = useOrderStore((state) => state.orders);
    const { socket } = useSocket();
    const { showToast } = useToastStore();

    useEffect(() => {
        if (!socket) return;

        // Join the 'staff' room to receive notifications for all staff
        socket.emit('JOIN_ROOM', 'staff');

        const handleNewOrder = (orderData: { tableNumber: string }) => {
            showToast(`🔔 Đơn mới từ Bàn ${orderData.tableNumber}!`);
            // In a real app with a DB, you would invalidate a query cache here to refetch orders
        };

        socket.on('NEW_ORDER_NOTIFICATION', handleNewOrder);

        // Cleanup on component unmount
        return () => {
          socket.off('NEW_ORDER_NOTIFICATION', handleNewOrder);
        };
      }, [socket, showToast]);


    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
    const readyOrders = orders.filter(o => o.status === OrderStatus.READY).sort((a,b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="sticky top-0 bg-white shadow-md p-4 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-primary">Nhân viên</h1>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                    </Button>
                </div>
            </header>
            <main className="p-4 space-y-8">
                 <section>
                    <h2 className="flex items-center text-xl font-bold mb-3">
                        <Bell className="mr-2 text-amber-500" />
                        Đơn hàng mới ({pendingOrders.length})
                    </h2>
                    {pendingOrders.length > 0 ? (
                        <div className="space-y-4">
                            {pendingOrders.map(order => <PendingOrderCard key={order.id} order={order} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Không có đơn hàng mới.</p>
                    )}
                 </section>

                 <section>
                    <h2 className="flex items-center text-xl font-bold mb-3">
                        <ChefHat className="mr-2 text-green-500" />
                        Sẵn sàng phục vụ ({readyOrders.length})
                    </h2>
                     {readyOrders.length > 0 ? (
                        <div className="space-y-4">
                            {readyOrders.map(order => <ReadyOrderCard key={order.id} order={order} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Chưa có món nào sẵn sàng.</p>
                    )}
                 </section>
            </main>
        </div>
    );
};

export default WaiterScreen;
