"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useTableStore } from "@/store/useTableStore";
import { UtensilsCrossed, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function BottomNav() {
    const { t } = useI18n();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tableIdFromUrl = searchParams.get("tableId");
    const { tableId: tableIdFromStore } = useTableStore();

    // Prioritize URL param, fallback to store
    const tableId = tableIdFromUrl || tableIdFromStore;

    const cartItemCount = useCartStore((state) => state.items.length); // or total quantity

    // Helper to determine active state
    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                <Link
                    href={`/guest?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/guest") ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <UtensilsCrossed className="w-6 h-6 mb-1" strokeWidth={isActive("/guest") ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{t('menu.title') || 'Thực đơn'}</span>
                </Link>
                <Link
                    href={`/guest/cart?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/guest/cart") ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6 mb-1" strokeWidth={isActive("/guest/cart") ? 2.5 : 2} />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">{t('nav.cart') || 'Giỏ hàng'}</span>
                </Link>
                <Link
                    href={`/guest/orders?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/guest/orders") ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <ClipboardList className="w-6 h-6 mb-1" strokeWidth={isActive("/guest/orders") ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{t('nav.orders') || 'Đơn hàng'}</span>
                </Link>
                <Link
                    href={`/guest/profile?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive("/guest/profile") ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <User className="w-6 h-6 mb-1" strokeWidth={isActive("/guest/profile") ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{t('nav.profile') || 'Tài khoản'}</span>
                </Link>
            </div>
        </div>
    );
}
