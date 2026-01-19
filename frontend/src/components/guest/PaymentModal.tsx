"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import { CreditCard, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ amount, onSuccess, onClose }: { amount: number, onSuccess: () => void, onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage("");

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required'
        });

        if (error) {
            setErrorMessage(error.message ?? "Thanh toán thất bại. Vui lòng thử lại.");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success("🎉 Thanh toán thành công!");
            onSuccess();
            onClose();
        } else {
            setErrorMessage("Thanh toán chưa hoàn tất. Vui lòng thử lại.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {errorMessage && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4" />
                <span>Thanh toán được bảo mật bởi Stripe</span>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        <span>Thanh toán {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</span>
                    </>
                )}
            </button>
        </form>
    );
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }: PaymentModalProps) {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && amount > 0) {
            setLoading(true);
            setError("");
            setClientSecret("");

            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.message || "Không thể khởi tạo thanh toán");
                    }
                    return data;
                })
                .then((data) => {
                    setClientSecret(data.clientSecret);
                })
                .catch((err) => {
                    console.error("Error creating payment intent", err);
                    setError(err.message || "Không thể kết nối với cổng thanh toán");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, amount]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                    <DialogTitle className="text-xl font-bold mb-2 flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        Thanh Toán Online
                    </DialogTitle>

                    <p className="text-slate-500 text-sm mb-4">
                        Thanh toán an toàn qua thẻ tín dụng/ghi nợ
                    </p>

                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mb-4">
                        <div className="text-sm opacity-90">Tổng thanh toán</div>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                            <p className="text-slate-600">Đang khởi tạo cổng thanh toán...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6">
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-medium">{error}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-600 hover:text-slate-800 font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : clientSecret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: 'stripe',
                                    variables: {
                                        colorPrimary: '#3b82f6',
                                        borderRadius: '8px',
                                    }
                                }
                            }}
                        >
                            <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
                        </Elements>
                    ) : null}

                    <button
                        onClick={onClose}
                        className="mt-4 text-sm text-slate-500 hover:text-slate-700 w-full text-center py-2 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

