"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { useI18n } from "@/contexts/I18nContext";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  Heart,
  Share2
} from "lucide-react";
import { productsApi } from "@/lib/api/products";

const formatPrice = (price: number | string) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getById(productId);
        setProduct(data);
      } catch (err: any) {
        setError(t('productDetail.notFound') || "Không tìm thấy món hoặc đã bị xoá.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, t]);

  const allergens = useMemo(() => {
    if (!product?.allergens) return [];
    return product.allergens
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
  }, [product]);

  const images = useMemo(() => {
    if (!product?.images || product.images.length === 0) {
      return [{ url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", isPrimary: true }];
    }
    // Sort to put primary image first
    return [...product.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  }, [product]);

  const isAvailable = product?.status === "AVAILABLE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-orange-100/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-orange-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">{t('productDetail.backToMenu') || "Quay lại"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-orange-50 text-gray-500 hover:text-rose-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50">
            <div className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-6 bg-gray-200 rounded-lg w-1/4" />
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-red-100 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('productDetail.notFoundTitle') || "Không tìm thấy món"}
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('productDetail.backToMenu') || "Quay lại menu"}
            </Link>
          </div>
        )}

        {/* Product Content */}
        {!loading && !error && product && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={images[selectedImageIndex]?.url || images[0]?.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${isAvailable
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                      }`}
                  >
                    {isAvailable ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('menu.statusAvailable') || "Còn món"}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>{t('menu.statusSoldOut') || "Hết món"}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                    {product.category?.name || "Khác"}
                  </span>
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                        ? 'border-white shadow-lg scale-110'
                        : 'border-white/50 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={img.url}
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Title & Price */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.prepTimeMinutes && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{product.prepTimeMinutes} {t('productDetail.minutes') || "phút"}</span>
                    </div>
                  )}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  {t('productDetail.description') || "Mô tả"}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || t('menu.noDescription') || "Món ăn ngon miệng được chế biến từ những nguyên liệu tươi ngon nhất."}
                </p>
              </div>

              {/* Allergens */}
              {allergens.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {t('productDetail.allergens') || "Thông tin dị ứng"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {allergens.map((a, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-sm font-medium border border-amber-200"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Button - Redirects to Tables page */}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/tables"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-xl hover:shadow-orange-200 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>{t('cart.startOrdering') || "Bắt đầu đặt món"}</span>
                </Link>
                <p className="text-center text-sm text-gray-500 mt-3">
                  {t('productDetail.selectTableHint') || "Chọn bàn để bắt đầu gọi món"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}
