"use client";

import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, Search, UtensilsCrossed, ChefHat, Star, Sparkles } from "lucide-react";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useMenuStore } from "@/store/useMenuStore";

const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Number(price));
};

function MenuContent() {
    const { t } = useI18n();
    const {
        products,
        isLoading,
        searchQuery,
        activeCategory,
        setSearchQuery,
        setActiveCategory,
        fetchProducts,
        searchProducts
    } = useMenuStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'popularity'>('default');

    const ITEMS_PER_PAGE = 12;
    const observerTarget = useRef(null);

    // Fetch products on mount (uses cache if available)
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localSearch !== searchQuery) {
                if (localSearch.trim()) {
                    searchProducts(localSearch);
                } else if (searchQuery) {
                    fetchProducts(true);
                }
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localSearch, searchQuery, searchProducts, fetchProducts]);

    // Extract categories
    const categories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category?.name || "Other"));
        return [t('menu.allCategories'), ...Array.from(cats).sort()];
    }, [products, t]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Filter by Category
        if (activeCategory !== "") {
            filtered = filtered.filter((product) =>
                (product.category?.name || "Other") === activeCategory
            );
        }

        // Sort
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'popularity') {
            filtered.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        }

        return filtered;
    }, [products, activeCategory, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && currentPage < totalPages) {
                    setCurrentPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, currentPage, totalPages]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, sortBy, localSearch]);

    const handleCategorySelect = useCallback((cat: string) => {
        setActiveCategory(cat === t('menu.allCategories') ? "" : cat);
    }, [setActiveCategory, t]);

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="font-bold text-xl flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg shadow-lg shadow-orange-200">
                                <UtensilsCrossed className="w-5 h-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                                {t('menu.title')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            href="/tables"
                            className="group relative text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <ChefHat className="w-4 h-4" />
                                {t('cart.startOrdering')}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 pb-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={t('menu.searchPlaceholder')}
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full bg-[#f5f6fa] border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                            />
                            <Search className={`absolute left-3 top-3 w-5 h-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-slate-400'}`} />
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#f5f6fa] border border-gray-200 rounded-xl px-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500"
                        >
                            <option value="default">{t('menu.sortDefault') || 'Default'}</option>
                            <option value="popularity">{t('menu.sortPopular') || 'Popular'}</option>
                            <option value="price_asc">{t('menu.sortPriceAsc') || 'Price: Low to High'}</option>
                            <option value="price_desc">{t('menu.sortPriceDesc') || 'Price: High to Low'}</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-rose-500 to-pink-500 py-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-3">
                            <Sparkles className="w-4 h-4" />
                            {t('menu.freshIngredients')}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {t('menu.heroTitle')}
                        </h1>
                        <p className="text-white/80 text-sm">
                            {t('menu.heroSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white pb-2 shadow-sm mb-4">
                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory === "" ? t('menu.allCategories') : activeCategory}
                    onSelect={handleCategorySelect}
                />
            </div>

            {/* Menu List - Same style as /guest */}
            <div className="px-4 space-y-4">
                {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 animate-pulse">
                            <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-200" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                            </div>
                        </div>
                    ))
                ) : paginatedProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        {t('menu.noItems')}
                    </div>
                ) : (
                    paginatedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/menu/items/${product.id}`}
                            className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
                        >
                            {/* Image */}
                            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={
                                        product.images.find((img) => img.isPrimary)?.url ||
                                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                                    }
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-800 line-clamp-1">
                                            {product.name}
                                        </h3>
                                    </div>
                                    {/* Rating Display */}
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-medium text-slate-600">
                                            {product.reviews && product.reviews.length > 0
                                                ? (product.reviews.reduce((a, b) => a + b.rating, 0) / product.reviews.length).toFixed(1)
                                                : "New"}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            ({product.reviews?.length || 0})
                                        </span>
                                    </div>
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {product.isChefRecommended && (
                                            <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200">
                                                {t('menu.chefsChoice')}
                                            </span>
                                        )}
                                        {(product.status === 'AVAILABLE' || !product.status) && (
                                            <span className="bg-green-100 text-green-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-green-200 uppercase">
                                                {t('menu.statusAvailable')}
                                            </span>
                                        )}
                                        {product.status === 'SOLD_OUT' && (
                                            <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-red-200 uppercase">
                                                {t('menu.statusSoldOut')}
                                            </span>
                                        )}
                                        {product.status === 'UNAVAILABLE' && (
                                            <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-gray-200 uppercase">
                                                {t('menu.statusUnavailable')}
                                            </span>
                                        )}
                                    </div>
                                    {product.description && (
                                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <span className="font-bold text-lg text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold">
                                        {t('menu.viewDetail') || "Chi tiết"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Infinite Scroll Loading Trigger */}
            {currentPage < totalPages && (
                <div ref={observerTarget} className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            )}

            {/* Items info */}
            <div className="px-4 pb-4 mt-4 text-center text-sm text-gray-500">
                {filteredProducts.length > 0 && t('menu.showingItems', {
                    start: 1,
                    end: Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length),
                    total: filteredProducts.length
                })}
            </div>

            {/* Footer */}
            <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">
                    {t('menu.madeWithLove')}
                </p>
            </div>
        </div>
    );
}

export default function PublicMenuPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <MenuContent />
        </Suspense>
    );
}
