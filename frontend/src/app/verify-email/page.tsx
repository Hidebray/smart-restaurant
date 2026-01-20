"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const { t } = useI18n();

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage(t('auth.verifyErrorDesc') || 'Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    // Tự động chuyển hướng sau 3 giây
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || t('auth.verifyErrorDesc') || 'Verification failed');
                }
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || t('auth.verifyErrorDesc'));
            }
        };

        verify();
    }, [token, router, t]);

    return (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 transform transition-all border border-white/50">
            {/* Logo hoặc Icon Header */}
            <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-tr from-orange-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                    {status === 'verifying' && <Loader2 className="w-10 h-10 text-white animate-spin" />}
                    {status === 'success' && <CheckCircle2 className="w-10 h-10 text-white" />}
                    {status === 'error' && <XCircle className="w-10 h-10 text-white" />}
                </div>
            </div>

            <div className="text-center space-y-4">
                {status === 'verifying' && (
                    <>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                            {t('auth.verifyTitle') || 'Xác Thực Email'}
                        </h2>
                        <p className="text-gray-600 font-medium">
                            {t('auth.verifying') || 'Đang xác thực...'}
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 className="text-3xl font-extrabold text-green-600">
                            {t('auth.verifySuccess') || 'Thành Công!'}
                        </h2>
                        <p className="text-gray-600">
                            {t('auth.verifySuccessDesc') || 'Email của bạn đã được xác minh thành công.'}
                        </p>
                        <p className="text-sm text-gray-500 mt-4 animate-pulse">
                            {t('auth.redirectLogin') || 'Đang chuyển hướng đến đăng nhập...'}
                        </p>
                        <Link
                            href="/login"
                            className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-bold transition-all hover:underline"
                        >
                            {t('auth.goToLogin') || 'Đến trang Đăng Nhập ngay'}
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-3xl font-extrabold text-red-600">
                            {t('auth.verifyError') || 'Thất Bại'}
                        </h2>
                        <p className="text-gray-600">
                            {message}
                        </p>
                        <div className="pt-6">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('auth.backToLogin') || 'Quay lại Đăng Nhập'}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-orange-100 via-rose-100 to-blue-100">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={
                    <div className="bg-white/80 p-8 rounded-3xl shadow-xl">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                }>
                    <VerifyEmailForm />
                </Suspense>
            </div>
        </div>
    );
}
