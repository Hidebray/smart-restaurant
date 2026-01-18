"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowLeft, Mail, Lock, LogIn, Info } from "lucide-react";

function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success(t('auth.loginSuccess'));

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        Cookies.set("accessToken", data.accessToken, { expires: 7 }); // Expires in 7 days
      }

      const role = data.role ? data.role.toUpperCase() : "";
      // Redirect based on role
      switch (role) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "WAITER":
          router.push("/waiter");
          break;
        case "KITCHEN":
          router.push("/kitchen");
          break;
        default:
          router.push("/tables");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle Google Auth Token
    if (token) {
      localStorage.setItem("accessToken", token);
      Cookies.set("accessToken", token, { expires: 7 });
      toast.success(t('auth.loginSuccess'));
      router.push("/tables");
      return;
    }

    // Check for existing session
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      // Sync cookie if missing
      if (!Cookies.get("accessToken")) {
        Cookies.set("accessToken", storedToken, { expires: 7 });
      }

      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then(user => {
          const role = user.role ? user.role.toUpperCase() : "";
          if (role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (role === 'WAITER') {
            router.push('/waiter');
          } else if (role === 'KITCHEN') {
            router.push('/kitchen');
          } else {
            router.push('/tables');
          }
        })
        .catch(() => {
          // Invalid token, stay on login
        });
    }
  }, [token, router, t]);
  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          {t('auth.welcomeBack')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-orange-500 group-hover:text-orange-400" aria-hidden="true" />
              </span>
            )}
            {loading ? t('common.loading') : t('auth.login')}
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
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/auth/google`}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            {t('auth.continueWithGoogle')}
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-gray-600">
        {t('auth.noAccount')}{" "}
        <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
          {t('auth.registerLink')}
        </Link>
      </p>

      {/* Demo Credentials Box */}
      <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-sm font-medium text-blue-800">{t('auth.credentialsTitle')}</h3>
            <div className="mt-2 text-sm text-blue-700 grid grid-cols-1 gap-1">
              <p><span className="font-semibold">Admin:</span> admin@smart.restaurant</p>
              <p><span className="font-semibold">Waiter:</span> waiter@smart.restaurant</p>
              <p><span className="font-semibold">Kitchen:</span> kitchen@smart.restaurant</p>
              <p className="mt-1 text-xs opacity-75">({t('auth.credentialsDefault')}: password@123)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPageContent() {
  const { t } = useI18n();

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
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
          alt="Restaurant background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
          <div className="absolute top-6 right-6">
            <LanguageSwitcher />
          </div>
          <h2 className="text-4xl font-bold mb-4">{t('common.appName')}</h2>
          <p className="text-lg text-white/90 max-w-md">
            {t('home.experienceDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
