"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/mobile/Header";
import { api } from "@/lib/api/api";
import { useTableStore } from "@/store/useTableStore";
import { useSearchParams } from "next/navigation";

interface CustomerProfile {
    id: string;
    email: string;
    name: string;
    phone: string;
    avatar: string | null;
    isEmailVerified: boolean;
    role: string;
}

export default function ProfilePage() {
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
                // 401 just means not logged in, which is handled by !profile check below
                // Redirect if not logged in
                // router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        try {
            // 1. Call server-side logout to clear cookies
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error("Logout failed", err);
        }

        // 2. Remove token
        localStorage.removeItem("accessToken");

        // 3. Clear state immediately to update UI
        setProfile(null);

        // 4. Clean redirect (using replace to avoid history stack issues)
        // Using window.location.href ensures a full page reload, clearing any in-memory api state
        window.location.href = `/guest?tableId=${tableId || ""}`;
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e74c3c]"></div>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="min-h-screen bg-[#f5f6fa]">
                <Header title="Profile" showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />
                <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                    <div className="text-6xl mb-2">👤</div>
                    <h2 className="text-xl font-bold text-gray-800">Not Logged In</h2>
                    <p className="text-gray-500">Log in to view your profile and order history.</p>
                    <Link
                        href="/login"
                        className="w-full max-w-xs bg-[#e74c3c] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200"
                    >
                        Log In / Register
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f6fa]">
            <Header title="My Profile" showBack backUrl={`/guest?tableId=${tableId || ""}`} tableId={tableId} />

            <div className="p-4 safe-area-pb space-y-4">
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow">
                            {profile.avatar ? (
                                <Image src={profile.avatar} alt={profile.name || 'User'} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-200">
                                    {(profile.name || 'U').charAt(0).toUpperCase()}
                                </div>
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
                            <div className="text-xs text-orange-600/80 uppercase font-bold tracking-wider">Points</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl text-center">
                            <div className="text-blue-600 font-bold text-xl">Member</div>
                            <div className="text-xs text-blue-600/80 uppercase font-bold tracking-wider">Status</div>
                        </div>
                    </div>
                </div>

                {/* Menu Options */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <MenuItem icon="📋" label="Order History" href="#" />
                    <MenuItem icon="❤️" label="Favorite Items" href="#" />
                    <MenuItem icon="⚙️" label="Account Settings" href="#" />
                    <MenuItem icon="❓" label="Help & Support" href="#" />
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
                >
                    Log Out
                </button>

                <div className="text-center text-xs text-gray-400 py-4">
                    Version 1.0.0
                </div>
            </div>
        </main>
    );
}

function MenuItem({ icon, label, href }: { icon: string, label: string, href: string }) {
    return (
        <Link href={href} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <span className="text-xl">{icon}</span>
            <span className="font-medium text-gray-700 flex-1">{label}</span>
            <span className="text-gray-400">›</span>
        </Link>
    )
}
