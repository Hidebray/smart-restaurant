"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, ModifierOption, ProductModifierGroup, Review } from "@/types"
import { useCartStore } from "@/store/useCartStore";
import { useMenuStore } from "@/store/useMenuStore";
import toast from "react-hot-toast";

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedModifiers, setSelelctedModifiers] = useState<Record<string, ModifierOption[]>>({});
    const [reviews, setReviews] = useState<Review[]>([]);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(1);
            setSelelctedModifiers({});

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

    if (!isOpen || !product) return null;

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
                    toast(`Just choose at most ${group.maxSelections} option`)
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
            toast("Please select all required options");
            return;
        }

        const allModifiers = Object.values(selectedModifiers).flat().map(mod => ({
            modifierOptionId: mod.id,
            name: mod.name,
            price: Number(mod.priceAdjustment)
        }));

        addToCart(product, quantity, allModifiers);
        onClose();

        toast.success("Added to cart!");
    };

    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(price));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">

                {/* Header: Ảnh món */}
                <div className="relative h-64 w-full shrink-0">
                    <Image
                        src={product.images.find((img) => img.isPrimary)?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Body: Cuộn được */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">{product.description}</p>

                    {/* Loop qua các nhóm Modifier (Size, Topping...) */}
                    <div className="mt-8 space-y-8">
                        {product.modifierGroups.sort((a, b) => a.displayOrder - b.displayOrder).map((groupWrapper) => {
                            const group = groupWrapper.modifierGroup;
                            return (
                                <div key={group.id}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {group.name}
                                            {group.isRequired && <span className="ml-2 text-red-500 text-xs font-normal bg-red-50 px-2 py-0.5 rounded-full">Bắt buộc</span>}
                                        </h3>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {group.selectionType === 'SINGLE' ? 'Chọn 1' : `Tối đa ${group.maxSelections}`}
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
                                <span className="text-xl">✨</span>
                                <h3 className="font-bold text-lg text-gray-800">Món ăn gợi ý (Related Items)</h3>
                            </div>
                            <RelatedItems
                                currentProductId={product.id}
                                categoryId={product.categoryId}
                                onClose={onClose}
                            />
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mt-10 border-t border-dashed pt-8 mb-4">
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Đánh giá từ khách hàng</h3>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-300">{reviews.length}</span>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">Chưa có đánh giá nào cho món này</p>
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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl h-12 p-1 shrink-0">
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600 font-bold text-lg disabled:opacity-50"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >−</button>
                            <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-600 font-bold text-lg"
                                onClick={() => setQuantity(quantity + 1)}
                            >+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-orange-600 text-white h-12 rounded-xl hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-200 flex items-center justify-between px-6"
                        >
                            <span className="font-bold">Thêm vào đơn</span>
                            <span className="font-medium bg-orange-700/50 px-2 py-0.5 rounded text-sm">
                                {formatPrice(calculateTotal())}
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function RelatedItems({ currentProductId, categoryId, onClose }: { currentProductId: string, categoryId: string, onClose: () => void }) {
    const { products } = useMenuStore();

    // Filter related items: same category, exclude current, limit to 3
    const related = products
        .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
        .slice(0, 3);

    if (related.length === 0) return <p className="text-gray-400 text-sm">Không có món gợi ý nào.</p>;

    // Note: Simple display for now. Switching product logic would require parent control update.
    return (
        <div className="grid grid-cols-3 gap-2">
            {related.map(item => (
                <div key={item.id} className="border rounded-lg p-2 flex flex-col items-center text-center bg-gray-50">
                    <div className="relative w-16 h-16 mb-2 rounded-md overflow-hidden bg-white">
                        <Image
                            src={item.images?.find(i => i.isPrimary)?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xs font-bold line-clamp-2 h-8">{item.name}</span>
                    <span className="text-xs text-orange-600 font-bold mt-1">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(item.price))}
                    </span>
                </div>
            ))}
        </div>
    );
}