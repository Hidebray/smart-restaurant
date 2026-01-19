"use client";

import { useState, useEffect, useMemo, Suspense, useRef, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import ProductModal from "@/components/ProductModal";
import Header from "@/components/mobile/Header";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import { useI18n } from "@/contexts/I18nContext";
import { Search } from "lucide-react";
import { useMenuStore } from "@/store/useMenuStore";

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

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name || "Other"));
    // Ensure "All" label is always first
    return [t('menu.allCategories'), ...Array.from(cats).sort()];
  }, [products, t]);

  // Filter products by category AND search AND sort
  const filteredProducts = useMemo(() => {
    // Create a copy to sort
    let filtered = [...products];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
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
              <option value="default">{t('menu.sortDefault') || 'Default'}</option>
              <option value="popularity">🔥 Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white pb-2 shadow-sm mb-4">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory === "" ? t('menu.allCategories') : activeCategory}
          onSelect={(cat) => setActiveCategory(cat === t('menu.allCategories') ? "" : cat)}
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
                  {product.isChefRecommended && (
                    <span className="shrink-0 ml-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                      👨‍🍳 Chef's Choice
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
                <button className="bg-[#e74c3c]/10 text-[#e74c3c] px-3 py-1 rounded-lg text-sm font-bold">
                  + {t('menu.add')}
                </button>
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
