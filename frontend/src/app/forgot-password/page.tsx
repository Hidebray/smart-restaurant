"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ForgotPasswordPage() {
    const { t } = useI18n();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col py-6 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-white">
                <div className="flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('auth.backToHome')}
                    </Link>
                    <div className="lg:hidden">
                        <LanguageSwitcher />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                {t('auth.forgotPasswordTitle')}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {t('auth.forgotPasswordDesc')}
                            </p>
                        </div>

                        {message ? (
                            <div className="rounded-xl bg-green-50 p-4 border border-green-100 text-center">
                                <div className="flex justify-center mb-2">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <h3 className="text-sm font-medium text-green-800">{t('common.success')}</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>{message}</p>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-green-600 hover:text-green-500 font-bold"
                                    >
                                        {t('auth.backToLogin')}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        {t('auth.email')}
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                            placeholder={t('auth.emailPlaceholder')}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">{t('common.error')}</h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {t('auth.sendResetLink')}
                                    </button>
                                </div>
                            </form>
                        )}

                        {!message && (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            {t('auth.or')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <Link
                                        href="/login"
                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t('auth.backToLogin')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1">
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
                    alt="Restaurant forgot password background"
                    fill
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                    <div className="absolute top-6 right-6">
                        <LanguageSwitcher />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{t('auth.forgotPasswordTitle')}</h2>
                    <p className="text-lg text-white/90 max-w-md">
                        {t('auth.forgotPasswordDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
}
