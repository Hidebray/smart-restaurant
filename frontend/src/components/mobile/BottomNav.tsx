"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useTableStore } from "@/store/useTableStore";

export default function BottomNav() {
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link
                    href={`/guest?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full ${isActive("/guest") ? "text-[#e74c3c]" : "text-gray-400"
                        }`}
                >
                    <span className="text-2xl mb-1">🏠</span>
                    <span className="text-xs font-medium">Menu</span>
                </Link>
                <Link
                    href={`/guest/cart?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full ${isActive("/guest/cart") ? "text-[#e74c3c]" : "text-gray-400"
                        }`}
                >
                    <div className="relative">
                        <span className="text-2xl mb-1">🛒</span>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-[#e74c3c] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium">Cart</span>
                </Link>
                <Link
                    href={`/guest/orders?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full ${isActive("/guest/orders") ? "text-[#e74c3c]" : "text-gray-400"
                        }`}
                >
                    <span className="text-2xl mb-1">📋</span>
                    <span className="text-xs font-medium">Orders</span>
                </Link>
                <Link
                    href={`/guest/profile?tableId=${tableId || ""}`}
                    className={`flex flex-col items-center justify-center w-full h-full ${isActive("/guest/profile") ? "text-[#e74c3c]" : "text-gray-400"
                        }`}
                >
                    <span className="text-2xl mb-1">👤</span>
                    <span className="text-xs font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
