"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { User, Mail, Lock, Phone, ArrowLeft, LogIn } from "lucide-react";

export default function RegisterPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: "CUSTOMER"
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            toast.success(t('auth.registerSuccess'));
            router.push("/login");

        } catch (error: any) {
            toast.error(error.message);
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
                                {t('auth.registerTitle')}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {t('auth.registerSubtitle')}
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    {t('auth.name')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
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
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder={t('auth.emailPlaceholder')}
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    {t('auth.phoneOptional')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="0912345678"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    {t('auth.password')}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('auth.creatingAccount')}
                                        </>
                                    ) : (
                                        t('auth.createAccount')
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        {t('auth.alreadyHaveAccount')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                >
                                    <LogIn className="h-4 w-4 mr-2 text-gray-500" />
                                    {t('auth.loginNow')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-0 flex-1">
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
                    alt="Restaurant register background"
                    fill
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                    <div className="absolute top-6 right-6">
                        <LanguageSwitcher />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{t('auth.registerTitle')}</h2>
                    <p className="text-lg text-white/90 max-w-md">
                        {t('auth.registerSubtitle')}
                    </p>
                </div>
            </div>
        </div>
    );
}
