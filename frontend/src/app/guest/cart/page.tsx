"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "@/lib/api/orders";
import Header from "@/components/mobile/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { useTableStore } from "@/store/useTableStore";
import Link from "next/link";

import { ShoppingCart, Trash2, Info } from "lucide-react";

import { useI18n } from "@/contexts/I18nContext";

function CartContent() {
    const { t } = useI18n();
    const { items, totalAmount, removeFromCart, updateQuantity, clearCart } =
        useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const tableIdFromUrl = searchParams.get("tableId");
    const { tableId: tableIdFromStore } = useTableStore();
    const tableId = tableIdFromUrl || tableIdFromStore;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);

    const handleCheckout = async () => {
        if (items.length === 0) return;

        if (!tableId) {
            toast.error(t('cart.tableIdError'));
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                tableId: tableId,
                notes: notes.trim() || undefined,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    modifiers:
                        item.modifiers && item.modifiers.length > 0
                            ? item.modifiers.map((m) => ({
                                modifierOptionId: m.modifierOptionId,
                            }))
                            : [],
                })),
            };

            await ordersApi.create(orderData);

            toast.success(t('cart.orderPlacedSuccess'));
            clearCart();
            setNotes("");
            router.push(`/guest/orders?tableId=${tableId}`);
        } catch (error: any) {
            console.error(error);
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header title={t('cart.title')} showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />

            <div className="p-4 safe-area-pb space-y-4">
                {/* Cart Items */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-slate-400">
                        <ShoppingCart className="w-16 h-16 mb-4 stroke-1" />
                        <p>{t('cart.empty')}</p>
                        <Link href={`/guest?tableId=${tableId || ""}`} className="mt-4 text-orange-600 font-bold hover:underline">{t('cart.startOrdering')}</Link>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={`${item.productId}-${index}`}
                            className="bg-white p-4 rounded-xl shadow-sm flex gap-4 border border-slate-100"
                        >
                            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 line-clamp-1">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {item.modifiers &&
                                            item.modifiers.map((m) => m.name).join(", ")}
                                    </div>
                                    <div className="text-gray-900 font-bold mt-1">
                                        {formatPrice(Number(item.totalPrice) / item.quantity)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold active:scale-95"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold w-4 text-center text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                            className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 font-bold active:scale-95"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Instructions */}
                {items.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-gray-800 mb-2">
                            {t('cart.specialInstructions') || 'Ghi chú đặc biệt'}
                        </h4>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-slate-50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c] text-slate-800 placeholder:text-slate-500 border border-slate-200 resize-none"
                            placeholder={t('cart.instructionsPlaceholder') || 'Ví dụ: Ít cay, không hành, giao nhanh...'}
                            rows={3}
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {notes.length}/500
                        </div>
                    </div>
                )}

                {/* Summary */}
                {items.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-2 border border-slate-100">
                        <h4 className="font-bold text-gray-800 mb-2">{t('cart.summary')}</h4>
                        <div className="flex justify-between text-gray-600">
                            <span>{t('cart.subtotal')}</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                        {/* Tax logic can be added here if needed */}
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-slate-100">
                            <span>{t('cart.total')}</span>
                            <span className="text-[#e74c3c]">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>
                )}

                {/* Info Note */}
                {items.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                            <strong>{t('cart.payAfterMealTitle')}</strong><br />
                            {t('cart.payAfterMealDesc')}
                        </div>
                    </div>
                )}

                {/* Action Bar */}
                {items.length > 0 && (
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                            className="w-full bg-[#e74c3c] text-white font-bold py-4 rounded-xl hover:bg-[#c0392b] active:scale-95 transition-all shadow-lg shadow-red-200 disabled:bg-gray-400"
                        >
                            {isSubmitting ? t('cart.placingOrder') : `${t('cart.placeOrder')} - ${formatPrice(totalAmount)}`}
                        </button>
                        <Link href={`/guest?tableId=${tableId || ""}`} className="w-full">
                            <button className="w-full bg-white text-[#e74c3c] border-2 border-[#e74c3c] font-bold py-3 rounded-xl">
                                {t('cart.continueBrowsing')}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

export default function CartPage() {
    return (
        <main className="min-h-screen bg-[#f5f6fa]">
            <Suspense fallback={<div>Loading...</div>}>
                <CartContent />
            </Suspense>
        </main>
    );
}
