"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productId: string;
}

export default function ReviewModal({ isOpen, onClose, productName, productId }: ReviewModalProps) {
    const { t } = useI18n();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error(t('review.loginRequired') || "Vui lòng đăng nhập để đánh giá!");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, rating, comment }),
            });

            if (res.status === 401) {
                toast.error(t('review.sessionExpired') || "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                // Optional: Trigger logout or redirect
                window.location.href = "/login";
                return;
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || t('review.error') || "Gửi đánh giá thất bại");
            }

            toast.success(t('review.success') || "Cảm ơn bạn đã đánh giá! ⭐");
            onClose();
            setComment("");
            setRating(5);
        } catch (error: any) {
            let msg = error.message;
            if (msg === "You have already reviewed this product") {
                msg = t('review.alreadyReviewed') || msg;
            }
            toast.error(msg || t('review.error') || "Lỗi khi gửi đánh giá");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-sm rounded bg-white p-6 shadow-xl">
                    <DialogTitle className="text-lg font-bold mb-4 text-slate-900">{t('review.title') || "Review Item"}: {productName}</DialogTitle>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('review.rating') || "Quality (Stars)"}</label>
                            <div className="flex justify-center gap-3 mt-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl p-1 transition-transform active:scale-95 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('review.comment') || "Comment (Optional)"}</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-slate-900 placeholder:text-gray-400"
                                rows={3}
                                placeholder={t('review.placeholder') || "The food was amazing..."}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 from-gray-50 to-gray-100"
                            >
                                {t('common.cancel') || "Cancel"}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {loading ? (t('common.loading') || "Loading...") : (t('review.submit') || "Submit Review")}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
