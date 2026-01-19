"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/mobile/Header";
import { api } from "@/lib/api/api";
import { useTableStore } from "@/store/useTableStore";
import { useI18n } from "@/contexts/I18nContext";
import { History, ChevronRight } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import toast from "react-hot-toast";

function OrderHistoryContent() {
    const { t } = useI18n();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const tableIdFromUrl = searchParams.get("tableId");
    const { tableId: tableIdFromStore } = useTableStore();
    const tableId = tableIdFromUrl || tableIdFromStore;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Assuming backend has an endpoint for user order history
            // Adjust endpoint if necessary (e.g. /orders/my-history)
            const res = await api.get("/orders/my-history");
            setOrders(res.data);
        } catch (error: any) {
            if (error.response?.status !== 404) { // Ignore 404 if no orders found yet
                console.error("Failed to load orders", error);
                // toast.error("Failed to load order history");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'COMPLETED':
                return "bg-green-100 text-green-700";
            case 'CANCELLED':
                return "bg-red-100 text-red-700";
            case 'PENDING':
                return "bg-yellow-100 text-yellow-700";
            case 'ACCEPTED':
                return "bg-blue-100 text-blue-700";
            case 'PREPARING':
                return "bg-purple-100 text-purple-700";
            case 'READY':
                return "bg-indigo-100 text-indigo-700";
            case 'SERVED':
                return "bg-teal-100 text-teal-700";
            case 'REJECTED':
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        // Simple capitalization or mapping
        // We can map specific statuses if we want
        const map: Record<string, string> = {
            'PENDING': t('orderStatus.pending') || 'Pending',
            'ACCEPTED': t('orderStatus.accepted') || 'Accepted',
            'REJECTED': t('orderStatus.rejected') || 'Rejected',
            'PREPARING': t('orderStatus.preparing') || 'Preparing',
            'READY': t('orderStatus.ready') || 'Ready',
            'SERVED': t('orderStatus.served') || 'Served',
            'COMPLETED': t('orderStatus.completed') || 'Completed',
            'CANCELLED': t('orderStatus.cancelled') || 'Cancelled',
        }
        return map[status] || status;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e74c3c]"></div>
            </div>
        );
    }

    return (
        <>
            <Header
                title={t("profile.orders.title") || "Order History"}
                showBack
                backUrl={`/guest/profile?tableId=${tableId || ""}`}
                tableId={tableId}
            />

            <div className="p-4 safe-area-pb">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <History className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{t("profile.orders.empty") || "No orders yet"}</h3>
                        <p className="text-gray-500 max-w-xs">{t("profile.orders.emptyDesc") || "Start ordering some delicious food!"}</p>
                        <Link
                            href={`/guest?tableId=${tableId || ""}`}
                            className="mt-4 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-colors"
                        >
                            {t("profile.orders.browseMenu") || "Browse Menu"}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-bold text-gray-800">{t('profile.orders.orderNumber', { id: order.id.slice(-6).toUpperCase() })}</div>
                                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.quantity}x {item.product.name}
                                            </span>
                                            {/* Option: show item price here */}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="text-xs text-gray-400 italic">
                                            {t('profile.orders.moreItems', { count: order.items.length - 3 })}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-dashed pt-3 flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">{t('profile.orders.total')}</span>
                                    <span className="font-bold text-orange-600 text-lg">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalAmount))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default function OrderHistoryPage() {
    return (
        <main className="min-h-screen bg-[#f5f6fa]">
            <Suspense fallback={<div>Loading...</div>}>
                <OrderHistoryContent />
            </Suspense>
        </main>
    )
}
