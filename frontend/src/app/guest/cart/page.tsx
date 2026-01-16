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

function CartContent() {
    const { items, totalAmount, removeFromCart, updateQuantity, clearCart } =
        useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            toast.error("Error: Table ID not found. Please rescan QR code.");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                tableId: tableId,
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

            toast.success("Order placed successfully!");
            clearCart();
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
            <Header title="Your Cart" showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />

            <div className="p-4 safe-area-pb space-y-4">
                {/* Cart Items */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-gray-400">
                        <span className="text-6xl mb-4">🛒</span>
                        <p>Your cart is empty.</p>
                        <Link href={`/guest?tableId=${tableId || ""}`} className="mt-4 text-[#e74c3c] font-bold">Start Ordering</Link>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={`${item.productId}-${index}`}
                            className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
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
                                        className="text-gray-400 p-2"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Instructions */}
                {items.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-2">
                            Special Instructions
                        </h4>
                        <textarea
                            className="w-full bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
                            placeholder="Any special requests? (e.g. no onions)"
                            rows={2}
                        />
                    </div>
                )}

                {/* Summary */}
                {items.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                        <h4 className="font-bold text-gray-800 mb-2">Order Summary</h4>
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>
                        {/* Tax logic can be added here if needed */}
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
                            <span>Total</span>
                            <span className="text-[#e74c3c]">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>
                )}

                {/* Info Note */}
                {items.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-blue-500 text-xl">ℹ️</span>
                        <div className="text-sm text-blue-700">
                            <strong>Pay After Your Meal</strong><br />
                            You can place multiple orders. Payment will be processed when you request the bill.
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
                            {isSubmitting ? "Placing Order..." : `Place Order - ${formatPrice(totalAmount)}`}
                        </button>
                        <Link href={`/guest?tableId=${tableId || ""}`} className="w-full">
                            <button className="w-full bg-white text-[#e74c3c] border-2 border-[#e74c3c] font-bold py-3 rounded-xl">
                                Continue Browsing
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
