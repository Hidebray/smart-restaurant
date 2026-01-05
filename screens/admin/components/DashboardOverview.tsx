
import React, { useMemo } from 'react';
import { useOrderStore } from '../../../store/useOrderStore';
import { useProductStore } from '../../../store/useProductStore';
import { OrderStatus, Order } from '../../../types';
import Card from '../../../components/ui/Card';
import StatCard from './StatCard';
import { DollarSign, ShoppingCart, Utensils, Star } from 'lucide-react';
import OrderStatusBadge from '../../../components/ui/OrderStatusBadge';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const DashboardOverview: React.FC = () => {
    const { orders } = useOrderStore();
    const { products } = useProductStore();

    const stats = useMemo(() => {
        const completedOrders = orders.filter(o => [OrderStatus.COMPLETED, OrderStatus.SERVED].includes(o.status));
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        
        const activeOrders = orders.filter(o => ![OrderStatus.COMPLETED, OrderStatus.SERVED, OrderStatus.REJECTED, OrderStatus.CANCELLED].includes(o.status)).length;
        
        const itemSales = new Map<string, number>();
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                itemSales.set(item.productId, (itemSales.get(item.productId) || 0) + item.quantity);
            });
        });
        
        let topSellingItem = { name: 'Chưa có', quantity: 0};
        if (itemSales.size > 0) {
            const topId = [...itemSales.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];
            const product = products.find(p => p.id === topId);
            if (product) {
                topSellingItem = { name: product.name, quantity: itemSales.get(topId)! };
            }
        }

        return { totalRevenue, activeOrders, topSellingItem };
    }, [orders, products]);

    const recentOrders = [...orders].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Tổng quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Tổng doanh thu"
                    value={formatPrice(stats.totalRevenue)}
                    icon={<DollarSign />}
                    color="green"
                />
                 <StatCard 
                    title="Đơn đang hoạt động"
                    value={stats.activeOrders.toString()}
                    icon={<ShoppingCart />}
                    color="blue"
                />
                 <StatCard 
                    title="Tổng số món"
                    value={products.length.toString()}
                    icon={<Utensils />}
                    color="amber"
                />
                 <StatCard 
                    title="Món bán chạy"
                    value={stats.topSellingItem.name}
                    icon={<Star />}
                    color="purple"
                />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Đơn hàng gần đây</h3>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bàn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 font-bold">#{order.tableNumber}</td>
                                    <td className="px-6 py-4">{formatPrice(order.totalPrice)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt.toLocaleTimeString('vi-VN')}</td>
                                    <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DashboardOverview;
