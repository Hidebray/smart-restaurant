"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Product, ModifierOption, ProductModifierGroup, Review } from "@/types"
import { useCartStore } from "@/store/useCartStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useI18n } from "@/contexts/I18nContext";
import { ChevronLeft, ChevronRight, ChefHat, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct?: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onSelectProduct }: ProductModalProps) {
    const { t } = useI18n();
    const [quantity, setQuantity] = useState(1);
    const [selectedModifiers, setSelelctedModifiers] = useState<Record<string, ModifierOption[]>>({});
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const addToCart = useCartStore((state) => state.addToCart);

    // Get sorted images (primary first)
    const images = useMemo(() => {
        if (!product?.images || product.images.length === 0) {
            return [{ url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", isPrimary: true, id: 'default' }];
        }
        return [...product.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    }, [product]);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            setSelelctedModifiers({});
            setSelectedImageIndex(0); // Reset to first image

            // Fetch reviews
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/reviews/product/${product.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setReviews(data);
                    else setReviews([]);
                })
                .catch(err => console.error("Failed to fetch reviews", err));
        }
    }, [isOpen, product]);

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!isOpen || !product) return null;

    // Check if product is out of stock based on inventory
    const isOutOfStock = product.inventory && product.inventory.quantity <= 0;
    const isLowStock = product.inventory && product.inventory.quantity > 0 && product.inventory.quantity <= product.inventory.minStock;
    const maxQuantity = product.inventory ? product.inventory.quantity : 999;
    const isUnavailable = product.status === 'SOLD_OUT' || product.status === 'UNAVAILABLE' || isOutOfStock;

    const handleModifierToggle = (group: ProductModifierGroup["modifierGroup"], option: ModifierOption) => {
        const groupId = group.id;
        const currentSelected = selectedModifiers[groupId] || [];
        const isSingle = group.selectionType === "SINGLE";

        let newSelected: ModifierOption[] = [];

        if (isSingle) {
            newSelected = [option];
        } else {
            const exists = currentSelected.find((item) => item.id == option.id);
            if (exists) {
                newSelected = currentSelected.filter((item) => item.id !== option.id);
            } else {
                if (group.maxSelections && currentSelected.length >= group.maxSelections) {
                    toast(t('productModal.maxSelectionError', { max: group.maxSelections }));
                    return;
                }
                newSelected = [...currentSelected, option];
            }
        }

        setSelelctedModifiers({
            ...selectedModifiers,
            [groupId]: newSelected,
        });
    };

    const calculateTotal = () => {
        const basePrice = Number(product.price);
        let modifiersPrice = 0;
        Object.values(selectedModifiers).forEach((options) => {
            options.forEach((opt) => {
                modifiersPrice += Number(opt.priceAdjustment);
            })
        });
        return (basePrice + modifiersPrice) * quantity;
    };

    const handleAddToCart = () => {
        const missingRequired = product.modifierGroups.some(g =>
            g.modifierGroup.isRequired && (!selectedModifiers[g.modifierGroup.id] || selectedModifiers[g.modifierGroup.id].length === 0)
        );

        if (missingRequired) {
            toast(t('productModal.requiredError'));
            return;
        }

        const allModifiers = Object.values(selectedModifiers).flat().map(mod => ({
            modifierOptionId: mod.id,
            name: mod.name,
            price: Number(mod.priceAdjustment)
        }));

        addToCart(product, quantity, allModifiers);
        onClose();

        toast.success(t('productModal.addedToCart'));
    };

    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header: Ảnh món với nút chuyển ảnh */}
                <div className="relative h-64 w-full shrink-0">
                    <Image
                        src={images[selectedImageIndex]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
                    >
                        ✕
                    </button>

                    {/* Navigation Arrows - Only show if multiple images */}
                    {images.length > 1 && (
                        <>
                            {/* Previous button */}
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Next button */}
                            <button
                                onClick={handleNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Image indicators (dots) */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === selectedImageIndex
                                            ? 'bg-white w-4 shadow-md'
                                            : 'bg-white/50 hover:bg-white/70'
                                            }`}
                                        aria-label={`Go to image ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Image counter */}
                            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                                {selectedImageIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Body: Cuộn được */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    <div className="flex justify-between items-start gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    </div>

                    {/* Rating Summary at Top */}
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 font-bold">★</span>
                        <span className="text-sm font-bold text-gray-700">
                            {product.reviews && product.reviews.length > 0
                                ? (product.reviews.reduce((a, b) => a + b.rating, 0) / product.reviews.length).toFixed(1)
                                : "New"}
                        </span>
                        <span className="text-xs text-gray-400">({reviews.length})</span>
                    </div>

                    {/* Status Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {product.isChefRecommended && (
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-200 uppercase tracking-wide flex items-center gap-1">
                                <ChefHat className="w-3 h-3" />
                                {t('menu.chefsChoice')}
                            </span>
                        )}
                        {/* Check inventory for stock status */}
                        {isOutOfStock ? (
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wide">
                                {t('menu.statusSoldOut')}
                            </span>
                        ) : isLowStock ? (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-200 uppercase tracking-wide">
                                {t('menu.lowStock') || 'Low Stock'} ({product.inventory?.quantity})
                            </span>
                        ) : product.status === 'SOLD_OUT' ? (
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 uppercase tracking-wide">
                                {t('menu.statusSoldOut')}
                            </span>
                        ) : product.status === 'UNAVAILABLE' ? (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 uppercase tracking-wide">
                                {t('menu.statusUnavailable')}
                            </span>
                        ) : (product.status === 'AVAILABLE' || !product.status) ? (
                            <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                                {t('menu.statusAvailable')}
                            </span>
                        ) : null}
                    </div>

                    {/* Allergens Info */}
                    {product.allergens && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                                <span className="font-bold uppercase tracking-wider mr-1">{t('menu.allergens')}:</span>
                                {product.allergens}
                            </span>
                        </div>
                    )}

                    <p className="text-gray-500 mt-4 text-sm leading-relaxed">{product.description}</p>

                    {/* Loop qua các nhóm Modifier (Size, Topping...) */}
                    <div className="mt-8 space-y-8">
                        {product.modifierGroups.sort((a, b) => a.displayOrder - b.displayOrder).map((groupWrapper) => {
                            const group = groupWrapper.modifierGroup;
                            return (
                                <div key={group.id}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {group.name}
                                            {group.isRequired && <span className="ml-2 text-red-500 text-xs font-normal bg-red-50 px-2 py-0.5 rounded-full">{t('productModal.required')}</span>}
                                        </h3>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {group.selectionType === 'SINGLE' ? t('productModal.chooseOne') : t('productModal.maxSelection', { max: group.maxSelections })}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {group.options.map((option) => {
                                            const isSelected = selectedModifiers[group.id]?.some(sel => sel.id === option.id);
                                            return (
                                                <div
                                                    key={option.id}
                                                    className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                        ? 'border-orange-500 bg-orange-50 shadow-sm'
                                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => handleModifierToggle(group, option)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                                            ? 'border-orange-500 accent-orange-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {isSelected && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                                        </div>
                                                        <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {option.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {Number(option.priceAdjustment) > 0 ? `+${formatPrice(Number(option.priceAdjustment))}` : ''}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Related Items Section */}
                    {product.category && (
                        <div className="mt-10 border-t border-dashed pt-8 mb-4">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-bold text-lg text-gray-800">{t('productModal.relatedItems')}</h3>
                            </div>
                            <RelatedItems
                                currentProductId={product.id}
                                categoryId={product.categoryId}
                                onSelectProduct={onSelectProduct}
                            />
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mt-10 border-t border-dashed pt-8 mb-4">
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="font-bold text-lg text-gray-800">{t('productModal.customerReviews')}</h3>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-300">{reviews.length}</span>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">{t('productModal.noReviews')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                                    {review.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{review.user.name}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400 text-xs">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={i < review.rating ? "opacity-100" : "opacity-20"}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-sm text-gray-600 pl-11">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer: Nút bấm */}
                <div className="p-4 border-t bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {/* Stock warning */}
                    {isLowStock && !isOutOfStock && (
                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700 text-center">
                            ⚠️ {t('menu.onlyXLeft', { count: product.inventory?.quantity }) || `Only ${product.inventory?.quantity} left in stock`}
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl h-12 p-1 shrink-0">
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600 font-bold text-lg disabled:opacity-50"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1 || isUnavailable}
                            >−</button>
                            <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600 font-bold text-lg disabled:opacity-50"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={isUnavailable || quantity >= maxQuantity}
                            >+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isUnavailable}
                            className={`flex-1 h-12 rounded-xl transition-all flex items-center justify-between px-6 shadow-lg ${!isUnavailable
                                ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-orange-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                        >
                            <span className="font-bold">
                                {isOutOfStock || product.status === 'SOLD_OUT'
                                    ? t('menu.statusSoldOut')
                                    : product.status === 'UNAVAILABLE'
                                        ? t('menu.statusUnavailable')
                                        : t('productModal.addToOrder')}
                            </span>
                            {!isUnavailable && (
                                <span className="font-medium bg-orange-700/50 px-2 py-0.5 rounded text-sm">
                                    {formatPrice(calculateTotal())}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function RelatedItems({ currentProductId, categoryId, onSelectProduct }: { currentProductId: string, categoryId: string, onSelectProduct?: (p: Product) => void }) {
    const { products } = useMenuStore();
    const { t } = useI18n();

    // Filter related items: same category, exclude current, limit to 4
    const related = products
        .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
        .slice(0, 4);

    if (related.length === 0) return <p className="text-gray-400 text-sm">{t('productModal.noRelatedItems')}</p>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map(item => (
                <div
                    key={item.id}
                    onClick={() => onSelectProduct?.(item)}
                    className="border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center bg-gray-50/50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group"
                >
                    <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-white shadow-sm group-hover:scale-105 transition-transform">
                        <Image
                            src={item.images?.find(i => i.isPrimary)?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xs font-bold line-clamp-2 h-8 text-gray-800 group-hover:text-orange-600 transition-colors uppercase tracking-tighter">
                        {item.name}
                    </span>
                    <span className="text-xs text-orange-600 font-bold mt-1">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(item.price))}
                    </span>
                </div>
            ))}
        </div>
    );
}