"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/mobile/Header";
import { api } from "@/lib/api/api";
import { useTableStore } from "@/store/useTableStore";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { User, History, Heart, Settings, HelpCircle, LogOut } from "lucide-react";

interface CustomerProfile {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatar: string | null;
    isEmailVerified: boolean;
    role: string;
}

function MenuItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
    return (
        <Link href={href} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <span className="text-slate-500">{icon}</span>
            <span className="font-medium text-gray-700 flex-1">{label}</span>
            <span className="text-gray-400">›</span>
        </Link>
    )
}

function ProfileContent() {
    const { t } = useI18n();
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tableIdFromUrl = searchParams.get("tableId");
    const { tableId: tableIdFromStore } = useTableStore();
    const tableId = tableIdFromUrl || tableIdFromStore;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setProfile(res.data);
            } catch (error: any) {
                if (error.response?.status !== 401) {
                    console.error("Failed to load profile", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error("Logout failed", err);
        }
        localStorage.removeItem("accessToken");
        setProfile(null);
        window.location.href = `/guest?tableId=${tableId || ""}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e74c3c]"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <>
                <Header title={t('profile.title')} showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />
                <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                        <User className="w-12 h-12" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{t('profile.notLoggedIn')}</h2>
                    <p className="text-gray-500">{t('profile.notLoggedInDesc')}</p>
                    <Link
                        href="/login"
                        className="w-full max-w-xs bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors"
                    >
                        {t('profile.loginRegister')}
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title={t('profile.title')} showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />

            <div className="p-4 safe-area-pb space-y-4">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow flex items-center justify-center">
                            {profile.avatar ? (
                                <Image src={profile.avatar} alt={profile.name || 'User'} fill className="object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-gray-400">{(profile.name || 'U').charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        {profile.isEmailVerified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{profile.email}</p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-orange-50 p-3 rounded-xl text-center">
                            <div className="text-orange-600 font-bold text-xl">0</div>
                            <div className="text-xs text-orange-600/80 uppercase font-bold tracking-wider">{t('profile.points')}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl text-center">
                            <div className="text-blue-600 font-bold text-xl">{t('profile.member')}</div>
                            <div className="text-xs text-blue-600/80 uppercase font-bold tracking-wider">{t('profile.memberStatus')}</div>
                        </div>
                    </div>
                </div>

                {/* Menu Options */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <MenuItem icon={<History className="w-5 h-5" />} label={t('profile.menu.orderHistory')} href="#" />
                    <MenuItem icon={<Heart className="w-5 h-5" />} label={t('profile.menu.favorites')} href="#" />
                    <MenuItem icon={<Settings className="w-5 h-5" />} label={t('profile.menu.settings')} href="#" />
                    <MenuItem icon={<HelpCircle className="w-5 h-5" />} label={t('profile.menu.help')} href="#" />
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    {t('common.logout')}
                </button>

                <div className="text-center text-xs text-gray-400 py-4">
                    {t('profile.version')} 1.0.0
                </div>
            </div>
        </>
    );
}

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-[#f5f6fa]">
            <Suspense fallback={<div>Loading...</div>}>
                <ProfileContent />
            </Suspense>
        </main>
    );
}
