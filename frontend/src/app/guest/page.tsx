"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "@/store/useCartStore";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/products", {
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

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("accessToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🍽️ Smart Restaurant
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            <span>Đăng xuất</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-2.062a.908.908 0 0 0 0-1.285L18.75 12m4.5 0-4.5 0"
              />
            </svg>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={
                    product.images.find((img) => img.isPrimary)?.url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded-md shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description || "Chưa có mô tả"}
                </p>
                <button className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  Thêm +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 active:scale-90 transition-all flex items-center gap-3 animate-bounce-in"
        >
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
              {cartTotal}
            </span>
          </div>
          <span className="font-bold pr-2 hidden md:block">Xem giỏ hàng</span>
        </button>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableId={tableId}
      />
    </main>
  );
}
