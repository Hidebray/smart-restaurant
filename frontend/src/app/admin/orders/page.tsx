"use client";

import { useState } from "react";
import useSWR from "swr";
import { ordersApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/contexts/I18nContext";

const getStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return "text-yellow-600 bg-yellow-100";
        case "ACCEPTED":
            return "text-blue-600 bg-blue-100";
        case "PREPARING":
            return "text-orange-600 bg-orange-100";
        case "READY":
            return "text-green-600 bg-green-100";
        case "SERVED":
            return "text-purple-600 bg-purple-100";
        case "COMPLETED":
            return "text-gray-600 bg-gray-100";
        case "CANCELLED":
            return "text-red-600 bg-red-100";
        case "REJECTED":
            return "text-red-600 bg-red-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

type FilterGroup = "ALL" | "RECEIVED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export default function OrderListPage() {
    const { t } = useI18n();
    const { data: orders, error } = useSWR<Order[]>("admin-orders", ordersApi.getAll);
    const [filterStatus, setFilterStatus] = useState<FilterGroup>("ALL");

    if (error) return <div>{t('common.error')}</div>;
    if (!orders) return <div>{t('common.loading')}</div>;

    // Define filter groups mapping
    const getFilteredOrders = () => {
        if (!orders) return [];
        if (filterStatus === "ALL") return orders;

        return orders.filter((o) => {
            switch (filterStatus) {
                case "RECEIVED":
                    return o.status === "PENDING" || o.status === "ACCEPTED";
                case "PREPARING":
                    return o.status === "PREPARING";
                case "READY":
                    return o.status === "READY";
                case "COMPLETED":
                    // Include SERVED in completed view? Usually Served means food served, Completed means paid/done.
                    // Let's allow users to see SERVED here as well, or maybe separate?
                    // Request says "Completed", usually implies final state.
                    // But if orders stay in SERVED until paid, they might be "active" but not "cooking".
                    // Let's assume COMPLETED group = SERVED + COMPLETED to simplify "Done with kitchen"
                    return o.status === "SERVED" || o.status === "COMPLETED";
                case "CANCELLED":
                    return o.status === "CANCELLED" || o.status === "REJECTED";
                default:
                    return true;
            }
        });
    };

    const filteredOrders = getFilteredOrders();

    const filters: { value: FilterGroup; label: string }[] = [
        { value: "ALL", label: t('menu.allCategories') },
        { value: "RECEIVED", label: t('common.received') }, // "Received"
        { value: "PREPARING", label: t('status.PREPARING') },
        { value: "READY", label: t('status.READY') },
        { value: "COMPLETED", label: t('status.COMPLETED') },
        { value: "CANCELLED", label: t('status.CANCELLED') },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{t('admin.orders')}</h1>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilterStatus(f.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === f.value
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-xs uppercase text-gray-800 font-semibold tracking-wider">
                                <th className="p-4">{t('orders.orderNumber')}</th>
                                <th className="p-4">{t('kitchen.table')}</th>
                                <th className="p-4">{t('menu.sortDate')}</th>
                                <th className="p-4">{t('cart.items')}</th>
                                <th className="p-4">{t('common.price')}</th>
                                <th className="p-4">{t('common.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        {t('menu.noItems') || "No orders found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-gray-600">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {(order as any).table?.tableNumber || "T-?"}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="line-clamp-2 text-gray-700">
                                                {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">
                                            {formatPrice(Number(order.totalAmount))}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {t(`status.${order.status}`) || order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
