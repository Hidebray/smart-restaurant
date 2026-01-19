"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus } from "@/types";
import { ordersApi } from "@/lib/api/orders";
import Header from "@/components/mobile/Header";
import Link from "next/link";
import PaymentModal from "@/components/guest/PaymentModal";
import ReviewModal from "@/components/guest/ReviewModal";
import toast from "react-hot-toast";
import { Bell, CreditCard, Check, ClipboardList, Star, Clock } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "PENDING": return "text-yellow-700 bg-yellow-100 border-yellow-200";
        case "ACCEPTED": return "text-blue-700 bg-blue-100 border-blue-200";
        case "PREPARING": return "text-orange-700 bg-orange-100 border-orange-200";
        case "READY": return "text-green-700 bg-green-100 border-green-200";
        case "SERVED": return "text-purple-700 bg-purple-100 border-purple-200";
        case "COMPLETED": return "text-slate-600 bg-slate-100 border-slate-200";
        case "REJECTED":
        case "CANCELLED": return "text-red-700 bg-red-100 border-red-200";
        default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);


function OrdersContent() {
    const { t } = useI18n();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Review State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState<{ id: string, name: string } | null>(null);

    const searchParams = useSearchParams();
    const tableId = searchParams.get("tableId");

    const fetchOrders = async () => {
        if (!tableId) return;
        try {
            const data = await ordersApi.getByTable(tableId);
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [tableId]);

    const sessionTotal = Array.isArray(orders)
        ? orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
        : 0;

    // Filter unpaid orders (not COMPLETED or CANCELLED)
    const unpaidOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'REJECTED');
    const unpaidTotal = unpaidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const canPay = unpaidTotal > 0;

    const handlePaymentSuccess = async () => {
        try {
            await Promise.all(unpaidOrders.map(order =>
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${order.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'COMPLETED' })
                })
            ));
            toast.success(t('orders.allPaid'));
            fetchOrders();
        } catch (error) {
            console.error("Payment update failed", error);
            toast.error(t('orders.paymentUpdateError'));
        }
    };

    const handleCallWaiter = async (type: 'PAYMENT_CASH' | 'ASSISTANCE') => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tables/${tableId}/request-assistance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            toast.success(t('orders.callWaiterSuccess'));
        } catch (e) {
            toast.error(t('orders.callWaiterError'));
        }
    };

    return (
        <div className="safe-area-pb space-y-6">
            <Header
                title={t('nav.orders') || t('orders.title')}
                showBack
                backUrl={`/guest?tableId=${tableId || ""}`}
                tableId={tableId}
            />

            <div className="px-4 space-y-6">
                {orders.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-5 rounded-2xl shadow-lg shadow-orange-200">
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <div className="text-sm font-medium opacity-90">{t('orders.total')}</div>
                                <div className="text-3xl font-bold tracking-tight">
                                    {formatPrice(sessionTotal)}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCallWaiter('PAYMENT_CASH')}
                                    className="bg-white/20 text-white p-3 rounded-full font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center backdrop-blur-sm hover:bg-white/30"
                                    title={t('orders.callPayment')}
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                                {canPay ? (
                                    <button
                                        onClick={() => setIsPaymentModalOpen(true)}
                                        className="bg-white text-orange-600 px-5 py-2 rounded-full font-bold shadow-sm active:scale-95 transition-transform flex items-center gap-2 hover:bg-orange-50"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        <span>{t('orders.pay')}</span>
                                    </button>
                                ) : (
                                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-white/20">
                                        <Check className="w-4 h-4" />
                                        <span>{t('orders.paid')}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        {canPay && <div className="text-xs opacity-75 mt-2 text-right">{t('orders.remainingToPay')} {formatPrice(unpaidTotal)}</div>}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-slate-500">{t('common.loading')}</div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <ClipboardList className="w-16 h-16 mb-4 stroke-1" />
                        <p className="font-medium">{t('orders.noOrders')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="flex justify-between items-center p-4 border-b border-slate-50 bg-slate-50/50">
                                    <div>
                                        <div className="font-bold text-slate-800 flex items-center gap-2">
                                            {t('orders.orderNumber')}{order.id.slice(0, 8)}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {t(`status.${order.status}`)}
                                    </span>
                                </div>

                                <div className="p-4 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start text-sm">
                                            <div className="flex gap-3">
                                                <span className="font-bold text-slate-500 w-6 pt-0.5">{item.quantity}x</span>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <div className="text-slate-800 font-medium text-base">
                                                            {item.product.name}
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProductForReview({
                                                                    id: item.product.id,
                                                                    name: item.product.name
                                                                });
                                                                setIsReviewModalOpen(true);
                                                            }}
                                                            className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded hover:bg-orange-100 transition-colors"
                                                        >
                                                            {t('review.reviewButton') || "Review"}
                                                        </button>
                                                    </div>
                                                    {item.modifiers && item.modifiers.length > 0 && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {item.modifiers.map((m) => m.modifierOption.name).join(", ")}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-slate-700 font-medium">
                                                {formatPrice(Number(item.totalPrice))}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={unpaidTotal}
                onSuccess={handlePaymentSuccess}
            />
            {selectedProductForReview && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    productId={selectedProductForReview.id}
                    productName={selectedProductForReview.name}
                />
            )}
        </div>
    );
}

export default function OrdersPage() {
    return (
        <main className="min-h-screen bg-[#f5f6fa]">
            <Suspense fallback={<div>Loading...</div>}>
                <OrdersContent />
            </Suspense>
        </main>
    );
}
