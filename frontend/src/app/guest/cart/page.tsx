"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { ordersApi } from "@/lib/api/orders";
import { loyaltyApi } from "@/lib/api/loyalty";
import Header from "@/components/mobile/Header";
import { useSearchParams, useRouter } from "next/navigation";
import { useTableStore } from "@/store/useTableStore";
import Link from "next/link";

import { ShoppingCart, Trash2, Info, Coins, Minus, Plus } from "lucide-react";

import { useI18n } from "@/contexts/I18nContext";

function CartContent() {
    const { t } = useI18n();
    const { items, totalAmount, removeFromCart, updateQuantity, clearCart } =
        useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountType: string; discountValue: number } | null>(null);
    const [isVoucherApplied, setIsVoucherApplied] = useState(false);
    const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

    // Loyalty points state
    const [availablePoints, setAvailablePoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const [isLoadingPoints, setIsLoadingPoints] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const tableIdFromUrl = searchParams.get("tableId");
    const { tableId: tableIdFromStore } = useTableStore();
    const tableId = tableIdFromUrl || tableIdFromStore;

    // Fetch loyalty points and user info on mount
    useEffect(() => {
        const fetchUserAndPoints = async () => {
            try {
                setIsLoadingPoints(true);
                
                const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
                if (!token) {
                    setIsLoggedIn(false);
                    setAvailablePoints(0);
                    return;
                }

                // Fetch user profile to get userId
                try {
                    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (profileRes.ok) {
                        const user = await profileRes.json();
                        console.log("User profile fetched:", user);
                        if (user?.id) {
                            setUserId(user.id);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch user profile:", e);
                }
                
                const data = await loyaltyApi.getMyPoints();
                console.log("Loyalty points fetched:", data);
                // Handle both possible field names
                const points = data.points ?? data.balance ?? 0;
                setAvailablePoints(points);
                setIsLoggedIn(true);
            } catch (error: any) {
                console.error("Loyalty points fetch error:", error?.response?.status, error?.message);
                // If 401 or no token, user is not logged in
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    setIsLoggedIn(false);
                } else {
                    // Other errors - still show as logged in (might be network issue)
                    // Check if we have a token to determine login state
                    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
                    setIsLoggedIn(!!token);
                }
                setAvailablePoints(0);
            } finally {
                setIsLoadingPoints(false);
            }
        };

        fetchUserAndPoints();
    }, []);

    // Calculate points discount (100 points = 10,000 VND)
    const pointsDiscountAmount = (pointsToUse / 100) * 10000;

    // Handle points adjustment
    const handleIncreasePoints = () => {
        const maxPoints = Math.min(availablePoints, Math.floor(totalAmount / 10000) * 100);
        if (pointsToUse + 100 <= maxPoints) {
            setPointsToUse(pointsToUse + 100);
        }
    };

    const handleDecreasePoints = () => {
        if (pointsToUse >= 100) {
            setPointsToUse(pointsToUse - 100);
        }
    };

    const handleUseAllPoints = () => {
        const maxPoints = Math.min(availablePoints, Math.floor(totalAmount / 10000) * 100);
        // Round down to nearest 100
        const roundedMax = Math.floor(maxPoints / 100) * 100;
        setPointsToUse(roundedMax);
    };

    const handleClearPoints = () => {
        setPointsToUse(0);
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setIsValidatingVoucher(true);
        try {
            // Check voucher validity via API (Need to create endpoint or just try to use it)
            // Ideally we validate first. But here we can simulate or call an endpoint.
            // Since we don't have a separate validate endpoint yet, let's assume we implement one or just trust the apply?
            // Wait, we need to show the discount BEFORE ordering. 
            // Let's call a new endpoint: /vouchers/validate
            // Or use ordersApi if we add a validate method.
            // For now, let's just make a POST to /vouchers/validate (we need to create this in backend)
            // Or simpler: We can just let them enter it and it validates on submission? 
            // No, UX requires showing the discount.

            // Temporary: Just fake it if no endpoint, but we should make one.
            // Let's assume we added GET /vouchers/:code/validate
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/vouchers/validate?code=${voucherCode}&amount=${totalAmount}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Mã không hợp lệ');
            }
            const voucher = await res.json();
            setAppliedVoucher(voucher);
            setIsVoucherApplied(true);
            toast.success(t('cart.voucherSuccess') || "Áp dụng mã giảm giá thành công!");
        } catch (error: any) {
            toast.error(error.message || t('cart.voucherError') || "Mã giảm giá không hợp lệ");
            setAppliedVoucher(null);
            setIsVoucherApplied(false);
        } finally {
            setIsValidatingVoucher(false);
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;

        if (!tableId) {
            toast.error(t('cart.tableIdError'));
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData: any = {
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
                voucherCode: isVoucherApplied ? voucherCode : undefined,
            };

            // Add customerId and pointsToRedeem if user is logged in
            if (userId) {
                orderData.customerId = userId;
                if (pointsToUse > 0) {
                    orderData.pointsToRedeem = pointsToUse;
                }
            }

            console.log("Creating order with data:", orderData);
            await ordersApi.create(orderData);

            toast.success(t('cart.orderPlacedSuccess'));
            clearCart();
            setNotes("");
            setVoucherCode("");
            setAppliedVoucher(null);
            setIsVoucherApplied(false);
            setPointsToUse(0);
            // Refresh points after order
            if (isLoggedIn) {
                try {
                    const data = await loyaltyApi.getMyPoints();
                    setAvailablePoints(data.points || 0);
                } catch (e) {
                    // Ignore
                }
            }
            router.push(`/guest/orders?tableId=${tableId}`);
        } catch (error: any) {
            console.error(error);
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate discount
    let voucherDiscountAmount = 0;
    if (appliedVoucher) {
        if (appliedVoucher.discountType === 'PERCENT') {
            voucherDiscountAmount = (totalAmount * appliedVoucher.discountValue) / 100;
        } else {
            voucherDiscountAmount = Math.min(appliedVoucher.discountValue, totalAmount);
        }
    }
    const totalDiscount = voucherDiscountAmount + pointsDiscountAmount;
    const finalTotal = Math.max(0, totalAmount - totalDiscount);

    return (
        <>
            <Header title={t('cart.title')} showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />

            <div className="p-4 safe-area-pb space-y-4">
                {/* Cart Items */}
                {/* ... (Previous items rendering code remains same, no changes needed inside map) ... */}
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

                {/* Loyalty Points - Show when logged in */}
                {items.length > 0 && isLoggedIn && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-yellow-500" />
                                {t('cart.usePoints') || 'Dùng điểm tích lũy'}
                            </h4>
                            <div className="text-sm text-gray-600">
                                {t('cart.availablePoints') || 'Có'}: <span className="font-bold text-orange-600">{availablePoints.toLocaleString()}</span> {t('cart.points') || 'điểm'}
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <p className="text-xs text-yellow-800">
                                {t('cart.pointsRule') || '100 điểm = 10,000 VND giảm giá. Tối thiểu 100 điểm.'}
                            </p>
                        </div>

                        {availablePoints >= 100 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                                        <button
                                            onClick={handleDecreasePoints}
                                            disabled={pointsToUse < 100}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 font-bold disabled:opacity-30 active:scale-95 border border-gray-200"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <div className="text-center min-w-[80px]">
                                            <div className="font-bold text-lg text-gray-900">{pointsToUse.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">{t('cart.points') || 'điểm'}</div>
                                        </div>
                                        <button
                                            onClick={handleIncreasePoints}
                                            disabled={pointsToUse + 100 > Math.min(availablePoints, Math.floor(totalAmount / 10000) * 100)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 font-bold disabled:opacity-30 active:scale-95 border border-gray-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        {pointsToUse > 0 && (
                                            <button
                                                onClick={handleClearPoints}
                                                className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium"
                                            >
                                                {t('cart.clearPoints') || 'Xóa'}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleUseAllPoints}
                                            disabled={pointsToUse === Math.floor(Math.min(availablePoints, Math.floor(totalAmount / 10000) * 100) / 100) * 100}
                                            className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"
                                        >
                                            {t('cart.useMax') || 'Dùng tối đa'}
                                        </button>
                                    </div>
                                </div>

                                {pointsToUse > 0 && (
                                    <div className="mt-3 text-sm text-green-600 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        {t('cart.pointsDiscount') || 'Giảm'} {formatPrice(pointsDiscountAmount)} ({pointsToUse} {t('cart.points') || 'điểm'})
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-2">
                                {t('cart.notEnoughPoints') || 'Bạn cần tối thiểu 100 điểm để đổi giảm giá. Hãy đặt thêm đơn để tích điểm!'}
                            </div>
                        )}
                    </div>
                )}

                {/* Login prompt for loyalty */}
                {items.length > 0 && !isLoggedIn && !isLoadingPoints && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                        <div className="flex items-start gap-3">
                            <Coins className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">
                                    {t('cart.loginForPoints') || 'Đăng nhập để dùng điểm tích lũy'}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {t('cart.loginForPointsDesc') || 'Tích điểm mỗi đơn hàng và đổi lấy giảm giá!'}
                                </p>
                                <Link 
                                    href={`/login?redirect=/guest/cart?tableId=${tableId}`}
                                    className="text-sm font-bold text-orange-600 hover:underline"
                                >
                                    {t('cart.loginNow') || 'Đăng nhập ngay →'}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Voucher Input */}
                {items.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-gray-800 mb-2">
                            {t('cart.voucherTitle') || 'Mã giảm giá'}
                        </h4>
                        <div className="flex gap-2">
                            <input
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                placeholder={t('cart.voucherPlaceholder') || 'Nhập mã voucher'}
                                className="flex-1 bg-white rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-300 text-slate-900 placeholder:text-slate-400"
                                disabled={isVoucherApplied}
                            />
                            {isVoucherApplied ? (
                                <button
                                    onClick={() => {
                                        setVoucherCode("");
                                        setIsVoucherApplied(false);
                                        setAppliedVoucher(null);
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-sm"
                                >
                                    {t('cart.removeVoucher') || 'Xóa'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode.trim() || isValidatingVoucher}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm disabled:opacity-50 shadow-sm shadow-orange-100"
                                >
                                    {isValidatingVoucher ? '...' : (t('cart.applyVoucher') || 'Áp dụng')}
                                </button>
                            )}
                        </div>
                        {appliedVoucher && (
                            <div className="mt-2 text-sm text-green-600 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {t('cart.voucherApplied', {
                                    code: appliedVoucher.code,
                                    discount: appliedVoucher.discountType === 'PERCENT' ? `${appliedVoucher.discountValue}%` : formatPrice(appliedVoucher.discountValue)
                                }) || `Đã áp dụng mã: ${appliedVoucher.code}`}
                            </div>
                        )}
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
                        {voucherDiscountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>{t('cart.voucherDiscount') || 'Giảm voucher'}</span>
                                <span>- {formatPrice(voucherDiscountAmount)}</span>
                            </div>
                        )}
                        {pointsDiscountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>{t('cart.pointsDiscountLabel') || 'Giảm từ điểm'} ({pointsToUse} {t('cart.points') || 'điểm'})</span>
                                <span>- {formatPrice(pointsDiscountAmount)}</span>
                            </div>
                        )}
                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-green-600 font-bold border-t border-dashed border-slate-200 pt-2">
                                <span>{t('cart.totalDiscount') || 'Tổng giảm'}</span>
                                <span>- {formatPrice(totalDiscount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-slate-100">
                            <span>{t('cart.total')}</span>
                            <span className="text-[#e74c3c]">{formatPrice(finalTotal)}</span>
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
                            {isSubmitting ? t('cart.placingOrder') : `${t('cart.placeOrder')} - ${formatPrice(finalTotal)}`}
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
