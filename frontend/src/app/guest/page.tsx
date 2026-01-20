"use client";

import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import ProductModal from "@/components/ProductModal";
import Header from "@/components/mobile/Header";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import { useI18n } from "@/contexts/I18nContext";
import { Search, Star } from "lucide-react";
import { useMenuStore } from "@/store/useMenuStore";
import Fuse from "fuse.js";

const formatPrice = (price: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

function GuestMenuContent() {
  const { t } = useI18n();
  const { products, fetchProducts, isLoading } = useMenuStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const tableIdParam = searchParams.get("tableId"); // Legacy
  const tokenParam = searchParams.get("token"); // New secure way

  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [isValidating, setIsValidating] = useState(true);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'popularity'>((searchParams.get("sort") as any) || 'default');
  const router = useRouter();

  // We need to resolve the table ID either from the param or by fetching via token
  const [tableId, setTableId] = useState<string | null>(tableIdParam ?? null);

  const ITEMS_PER_PAGE = 12;

  // Initialize page from URL on mount
  useEffect(() => {
    const resolveTable = async () => {
      // 1. If we have a token, resolve it to a table ID
      if (tokenParam) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/tables/by-token/${tokenParam}`);
          if (res.ok) {
            const table = await res.json();
            if (table && table.id) {
              setTableId(table.id);
              setIsValidating(false);
              return; // Success, skip legacy validation
            }
          }
        } catch (e) {
          console.error("Invalid token", e);
        }
      }

      // 2. Fallback: If we have tableIdParam (Legacy or resolved), validate it
      if (tableIdParam) {
        setTableId(tableIdParam);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/tables/${tableIdParam}`);
          if (!res.ok) throw new Error('Table not found');
          const data = await res.json();
          if (!data || !data.id) throw new Error('Invalid table data');
          setIsValidating(false);
        } catch (error) {
          // Only redirect if NO token was present (if token failed, we might want to stay to show error?) 
          // but for now, redirect if validation fails
          router.replace('/tables');
        }
      } else if (!tokenParam) {
        // No ID, No Token -> Redirect
        router.replace('/tables');
      }
    };

    resolveTable();

    resolveTable();
  }, [tableIdParam, tokenParam, router]); // Remove searchParams dependency to avoid re-running on filter change causing loops with initialization logic if not careful, though harmless here as resolvedTable is idempotent-ish. Better:
  // Actually, we just need to run resolveTable once or when major params change. 
  // The state initialization from searchParams happens only on first render (useState initial value).
  // So we are good.

  // Fetch products (cached in store)
  useEffect(() => {
    if (tableId && !isValidating) {
      fetchProducts();
    }
  }, [tableId, isValidating, fetchProducts]);


  // Update URL when page or filters changes
  useEffect(() => {
    if (!tableId) return;

    const params = new URLSearchParams();
    params.set("tableId", tableId);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (activeCategory) params.set("category", activeCategory);
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== 'default') params.set("sort", sortBy);

    router.replace(`/guest?${params.toString()}`, { scroll: false });
  }, [currentPage, tableId, activeCategory, searchQuery, sortBy, router]);

  // Helper to translate category name
  const translateCategory = (catName: string) => {
    const translated = t(`menu.categories.${catName}`);
    // If translation key doesn't exist, return original name
    return translated.startsWith('menu.categories.') ? catName : translated;
  };

  // Extract unique categories (keep original names for filtering)
  const rawCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name || "Other"));
    return ["", ...Array.from(cats).sort()]; // "" represents "All"
  }, [products]);

  // Translated category names for display
  const categories = useMemo(() => {
    return rawCategories.map(cat => cat === "" ? t('menu.allCategories') : translateCategory(cat));
  }, [rawCategories, t]);

  // Filter products by category AND search AND sort
  const filteredProducts = useMemo(() => {
    // Create a copy to sort
    let filtered = [...products];

    // Fuzzy Search with Fuse.js (supports typo tolerance)
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'description', weight: 0.3 }
        ],
        threshold: 0.4, // 0 = exact match, 1 = match anything
        distance: 100, // How far to search for a match
        ignoreLocation: true, // Search anywhere in the string
        includeScore: true,
        minMatchCharLength: 2,
      });

      const results = fuse.search(searchQuery);
      filtered = results.map(result => result.item);
    }

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
      // Sort by orderCount descending
      filtered.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
    }

    return filtered;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Calculate pagination (Infinite Scroll style: show 0 to N)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);

  // Infinite Scroll Observer
  const observerTarget = useRef(null);

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
  }, [activeCategory, sortBy, searchQuery]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Header + Search */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <Header
          title={t('common.appName')}
          tableId={tableId}
          showBack={true}
          backUrl="/tables"
        />

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('menu.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f6fa] border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
              />
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f5f6fa] border border-gray-200 rounded-xl px-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500"
            >
              <option value="popularity">{t('menu.sortPopular') || 'Popular'}</option>
              <option value="price_asc">{t('menu.sortPriceAsc') || 'Price: Low to High'}</option>
              <option value="price_desc">{t('menu.sortPriceDesc') || 'Price: High to Low'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white pb-2 shadow-sm mb-4">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory === "" ? t('menu.allCategories') : translateCategory(activeCategory)}
          onSelect={(cat) => {
            // Find the original category name from translated name
            const index = categories.indexOf(cat);
            const originalCat = index >= 0 ? rawCategories[index] : "";
            setActiveCategory(originalCat);
          }}
        />
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-4">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 active:scale-[0.98] transition-transform cursor-pointer"
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
                {product.status === 'AVAILABLE' || !product.status ? (
                  <button className="bg-[#e74c3c]/10 text-[#e74c3c] px-3 py-1 rounded-lg text-sm font-bold active:scale-90 transition-transform">
                    + {t('menu.add')}
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs font-bold italic py-1">
                    {product.status === 'SOLD_OUT' ? t('menu.statusSoldOut') : t('menu.statusUnavailable')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {t('menu.noItems')}
          </div>
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

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={setSelectedProduct}
      />
    </>
  );
}

export default function GuestMenuPage() {
  return (
    <main className="min-h-screen bg-[#f5f6fa]">
      <Suspense fallback={<div>Loading...</div>}>
        <GuestMenuContent />
      </Suspense>
    </main>
  );
}
