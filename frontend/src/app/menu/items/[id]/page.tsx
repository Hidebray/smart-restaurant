"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { productsApi } from "@/lib/api/products";

const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getById(productId);
        setProduct(data);
      } catch (err: any) {
        setError("Không tìm thấy món hoặc đã bị xoá.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const allergens = useMemo(() => {
    if (!product?.allergens) return [];
    return product.allergens
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
  }, [product]);

  const isAvailable = product?.status === "AVAILABLE";

  const handleAddToCart = () => {
    if (!product || !isAvailable) return;
    addToCart(product, 1, []);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại menu</span>
            </Link>
          </div>
          <div className="text-sm text-gray-500">Chi tiết món</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-red-100 text-red-700 p-6 rounded-xl">
            <div className="font-semibold mb-2">Không tìm thấy món</div>
            <p className="text-sm text-red-600">{error}</p>
            <Link
              href="/menu"
              className="inline-flex mt-4 text-sm text-blue-600 hover:underline"
            >
              ← Quay lại menu
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative w-full h-64 sm:h-80">
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

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.category?.name}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${
                    isAvailable
                      ? "bg-green-100 text-green-900 border-green-300"
                      : "bg-red-100 text-red-900 border-red-300"
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Còn món</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Hết món</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-3xl font-bold text-orange-600">
                {formatPrice(product.price)}
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Mô tả
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "Không có mô tả."}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Dị ứng (Allergens)
                </h2>
                {allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((a, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-sm border border-amber-300 font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Không có thông tin dị ứng.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex-1 inline-flex items-center justify-center rounded-lg px-4 py-3 text-white font-semibold transition-colors ${
                    isAvailable
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAvailable ? "Thêm vào giỏ" : "Hết món"}
                </button>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 border border-gray-200 text-gray-800 font-semibold bg-white hover:bg-gray-50"
                >
                  Quay lại menu
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
