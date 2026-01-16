"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import ProductModal from "@/components/ProductModal";
import Header from "@/components/mobile/Header";
import CategoryTabs from "@/components/mobile/CategoryTabs";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

const formatPrice = (price: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

function GuestMenuContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loaded menu:", error);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name || "Other"));
    return ["All", ...Array.from(cats)].sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        (product.category?.name || "Other") === activeCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header title="Smart Restaurant" tableId={tableId} />

      {/* Search Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f6fa] border-none rounded-xl py-3 pl-10 pr-4 text-gray-700 focus:ring-2 focus:ring-[#e74c3c] outline-none"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white pb-2 shadow-sm mb-4">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-4">
        {filteredProducts.map((product) => (
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
