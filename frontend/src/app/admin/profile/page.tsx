"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { api } from "@/lib/api/api";
import { useI18n } from "@/contexts/I18nContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";

interface AdminProfile {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    avatar: string | null;
    role: string;
}

export default function AdminProfilePage() {
    const { t } = useI18n();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [pw, setPw] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const apiBase = useMemo(
        () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
        [],
    );

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/profile");
            setProfile(res.data);
            setForm({
                name: res.data?.name || "",
                email: res.data?.email || "",
                phone: res.data?.phone || "",
            });
        } catch (error: any) {
            toast.error(t('common.error') || "Failed to load profile");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        if (!form.name.trim()) {
            toast.error(t("profile.nameRequired") || "Name is required");
            return;
        }

        setSavingProfile(true);
        try {
            const res = await api.patch("/auth/profile", {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
            });
            setProfile(res.data);
            toast.success(t("profile.updateSuccess") || "Profile updated successfully");
        } catch (e: any) {
            const message = e?.response?.data?.message || "Update failed";
            toast.error(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pw.currentPassword || !pw.newPassword) {
            toast.error(t("profile.pwRequired") || "Please fill in all password fields");
            return;
        }
        if (pw.newPassword.length < 8) {
            toast.error(t("profile.pwMin") || "New password must be at least 8 characters");
            return;
        }
        if (pw.newPassword !== pw.confirmNewPassword) {
            toast.error(t("profile.pwMismatch") || "New password confirmation does not match");
            return;
        }

        setSavingPassword(true);
        try {
            await api.patch("/auth/change-password", {
                currentPassword: pw.currentPassword,
                newPassword: pw.newPassword,
            });
            toast.success(t("profile.pwChanged") || "Password changed successfully");
            setPw({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (e: any) {
            const message = e?.response?.data?.message || "Change password failed";
            toast.error(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setSavingPassword(false);
        }
    };

    const handleAvatarUpload = async (file: File | null) => {
        if (!file) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/auth/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProfile(res.data);
            toast.success(t("profile.avatarUpdated") || "Avatar updated successfully");
        } catch (e: any) {
            const message = e?.response?.data?.message || "Upload avatar failed";
            toast.error(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const avatarSrc = profile?.avatar
        ? profile.avatar.startsWith("http")
            ? profile.avatar
            : `${apiBase}${profile.avatar}`
        : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-2">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
                <p className="text-gray-500 mt-1">Manage your administrative profile settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Summary */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 mb-4 group">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                                        {avatarSrc ? (
                                            <Image
                                                src={avatarSrc}
                                                alt={profile?.name || "User"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl font-bold text-gray-300">
                                                {(profile?.name || "A").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <label
                                        className={`absolute bottom-0 right-0 p-2 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all ${uploading ? "bg-gray-200" : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {uploading ? (
                                            <Icons.Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                        ) : (
                                            <Icons.Camera className="w-4 h-4 text-white" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploading}
                                            onChange={(e) => handleAvatarUpload(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
                                <span className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {profile?.role}
                                </span>
                                <div className="mt-6 w-full pt-6 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Icons.Mail className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{profile?.email}</span>
                                    </div>
                                    {profile?.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Icons.Phone className="w-4 h-4 text-gray-400" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Forms */}
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Icons.User className="w-5 h-5 text-blue-500" />
                                {t('profile.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('profile.name')}</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('profile.email')}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('profile.phone')}</Label>
                                        <Input
                                            id="phone"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="Enter your phone"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" disabled={savingProfile} className="w-full sm:w-auto px-8">
                                        {savingProfile ? (
                                            <>
                                                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t('common.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Save className="mr-2 h-4 w-4" />
                                                {t('profile.save')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Icons.Lock className="w-5 h-5 text-orange-500" />
                                {t('profile.changePassword')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={pw.currentPassword}
                                            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                        >
                                            {showCurrentPassword ? <Icons.EyeOff className="h-4 w-4" /> : <Icons.Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                value={pw.newPassword}
                                                onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                            >
                                                {showNewPassword ? <Icons.EyeOff className="h-4 w-4" /> : <Icons.Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmNewPassword">{t('profile.confirmNewPassword')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmNewPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={pw.confirmNewPassword}
                                                onChange={(e) => setPw({ ...pw, confirmNewPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                            >
                                                {showConfirmPassword ? <Icons.EyeOff className="h-4 w-4" /> : <Icons.Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 text-right">
                                    <Button type="submit" disabled={savingPassword} variant="outline" className="w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50">
                                        {savingPassword ? (
                                            <>
                                                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t('common.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Icons.KeyRound className="mr-2 h-4 w-4" />
                                                {t('profile.updatePassword')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
