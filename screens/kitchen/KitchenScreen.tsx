
import React from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useSocket } from '../../context/SocketContext';
import { Order, OrderStatus } from '../../types';
import Button from '../../components/ui/Button';
import { LogOut } from 'lucide-react';
import Card from '../../components/ui/Card';
import OrderStatusBadge from '../../components/ui/OrderStatusBadge';

const TimeTracker: React.FC<{ startTime: Date }> = ({ startTime }) => {
    const [duration, setDuration] = React.useState('00:00');

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            const totalSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const seconds = (totalSeconds % 60).toString().padStart(2, '0');
            setDuration(`${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    const minutes = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    const color = minutes >= 10 ? 'text-red-500' : minutes >= 5 ? 'text-amber-500' : 'text-green-500';

    return <div className={`text-2xl font-bold font-mono ${color}`}>{duration}</div>;
};

const KitchenOrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const { updateOrderStatus } = useOrderStore();
    const { socket } = useSocket();
    const isAccepted = order.status === OrderStatus.ACCEPTED;

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        updateOrderStatus(order.id, newStatus);
        if (socket) {
            // Notify the specific table's room about the status change
            socket.emit('ORDER_STATUS_UPDATE', {
                room: `table_${order.tableId}`,
                payload: { orderId: order.id, status: newStatus }
            });
        }
    };

    return (
        <Card className="p-4 w-full md:w-80 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Bàn {order.tableNumber}</h3>
                <TimeTracker startTime={isAccepted ? order.createdAt : order.updatedAt} />
            </div>
            <div className="border-y-2 my-2 py-2 space-y-2 flex-grow">
                {order.items.map(item => (
                    <div key={item.productId} className="flex justify-between text-lg">
                        <span className="font-bold">{item.quantity}x</span>
                        <span className="flex-1 ml-3">{item.name}</span>
                    </div>
                ))}
            </div>
            {isAccepted ? (
                <Button size="lg" className="w-full mt-2" onClick={() => handleStatusUpdate(OrderStatus.PREPARING)}>Bắt đầu chuẩn bị</Button>
            ) : (
                <Button size="lg" className="w-full mt-2 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(OrderStatus.READY)}>Hoàn thành</Button>
            )}
        </Card>
    );
};

const KitchenScreen: React.FC = () => {
    const logout = useUserStore((state) => state.logout);
    const orders = useOrderStore((state) => state.orders);
    
    const todoOrders = orders.filter(o => o.status === OrderStatus.ACCEPTED).sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
    const preparingOrders = orders.filter(o => o.status === OrderStatus.PREPARING).sort((a,b) => a.updatedAt.getTime() - b.updatedAt.getTime());

    return (
        <div className="flex flex-col h-screen bg-gray-200">
            <header className="bg-white shadow-md p-4 z-10 flex-shrink-0">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-brand-dark">Bếp</h1>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-5 w-5 mr-2" /> Đăng xuất
                    </Button>
                </div>
            </header>
            <main className="flex-grow flex p-4 space-x-4 overflow-x-auto">
                {/* To Do Column */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold p-2 rounded-t-lg bg-blue-200 text-blue-800 w-full text-center">
                        Cần làm ({todoOrders.length})
                    </h2>
                    <div className="p-4 bg-gray-300 rounded-b-lg space-y-4 w-full h-full overflow-y-auto">
                        {todoOrders.length > 0 ? (
                           todoOrders.map(order => <KitchenOrderCard key={order.id} order={order} />)
                        ) : (
                            <p className="text-gray-600 text-center p-8">Không có đơn hàng mới.</p>
                        )}
                    </div>
                </div>

                {/* Preparing Column */}
                <div className="flex flex-col items-center flex-shrink-0">
                     <h2 className="text-2xl font-bold p-2 rounded-t-lg bg-indigo-200 text-indigo-800 w-full text-center">
                        Đang làm ({preparingOrders.length})
                    </h2>
                    <div className="p-4 bg-gray-300 rounded-b-lg space-y-4 w-full h-full overflow-y-auto">
                        {preparingOrders.length > 0 ? (
                           preparingOrders.map(order => <KitchenOrderCard key={order.id} order={order} />)
                        ) : (
                           <p className="text-gray-600 text-center p-8">Không có đơn hàng nào đang được chuẩn bị.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default KitchenScreen;
