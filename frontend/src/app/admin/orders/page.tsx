"use client";

import { useState } from "react";
import useSWR from "swr";
import { ordersApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { Card } from "@/components/ui/Card";

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
        default:
            return "text-gray-600 bg-gray-100";
    }
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

export default function OrderListPage() {
    const { data: orders, error } = useSWR<Order[]>("admin-orders", ordersApi.getAll);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    if (error) return <div>Failed to load orders</div>;
    if (!orders) return <div>Loading...</div>;

    const filteredOrders = filterStatus === "ALL"
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    "ALL",
                    "PENDING",
                    "ACCEPTED",
                    "PREPARING",
                    "READY",
                    "COMPLETED",
                    "CANCELLED",
                ].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <Card className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-xs uppercase text-gray-800 font-semibold tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Table</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            {/* <th className="p-4">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No orders found.
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
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
