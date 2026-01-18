"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
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
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const ITEMS_PER_PAGE = 12;

  // Initialize page from URL on mount
  useEffect(() => {
    // If no tableId, redirect to table selection
    if (!tableId) {
      router.replace('/tables');
      return;
    }

    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (page > 0) setCurrentPage(page);
    }
  }, [tableId, router, searchParams]);

  // Fetch products (cached in store)
  useEffect(() => {
    if (tableId) {
      fetchProducts();
    }
  }, [tableId, fetchProducts]);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage > 1 && tableId) {
      router.replace(`/guest?tableId=${tableId}&page=${currentPage}`, { scroll: false });
    } else if (tableId) {
      router.replace(`/guest?tableId=${tableId}`, { scroll: false });
    }
  }, [currentPage, tableId, router]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name || "Other"));
    // Ensure "All" label is always first
    return [t('menu.allCategories'), ...Array.from(cats).sort()];
  }, [products, t]);

  // Filter products by category AND search client-side
  const filteredProducts = useMemo(() => {
    let filtered = products;

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

    return filtered;
  }, [products, activeCategory, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header
        title={t('common.appName')}
        tableId={tableId}
        showBack={true}
        backUrl="/tables"
      />

      {/* Search Bar */}
      <div className="bg-white px-4 pb-3 sticky top-[57px] z-30 pt-2 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder={t('menu.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f6fa] border-none rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-[#e74c3c] outline-none"
          />
          <Search className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
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
                </div>
                <div className="text-yellow-400 text-sm mt-1">
                  ★★★★☆ <span className="text-gray-400 text-xs">(24)</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <button className="bg-[#e74c3c]/10 text-[#e74c3c] px-3 py-1 rounded-lg text-sm font-bold">
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No items found
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-4 py-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm"
          >
            ← Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const shouldShow =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!shouldShow) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${currentPage === page
                    ? 'bg-[#e74c3c] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm"
          >
            Next →
          </button>
        </div>
      )}

      {/* Items info */}
      <div className="px-4 pb-4 text-center text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} items
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
