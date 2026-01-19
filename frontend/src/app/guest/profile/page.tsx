"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/mobile/Header";
import { api } from "@/lib/api/api";
import { useTableStore } from "@/store/useTableStore";
import { useI18n } from "@/contexts/I18nContext";
import {
  User,
  History,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  Camera,
  Save,
  KeyRound,
  Award,
} from "lucide-react";

interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  isEmailVerified: boolean;
  role: string;
}

function MenuItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <span className="text-slate-500">{icon}</span>
      <span className="font-medium text-gray-700 flex-1">{label}</span>
      <span className="text-gray-400">›</span>
    </Link>
  );
}

function ProfileContent() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const tableIdFromUrl = searchParams.get("tableId");
  const { tableId: tableIdFromStore } = useTableStore();
  const tableId = tableIdFromUrl || tableIdFromStore;

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
    setErr(null);
    setMsg(null);
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data);
      setForm({
        name: res.data?.name || "",
        email: res.data?.email || "",
        phone: res.data?.phone || "",
      });
    } catch (error: any) {
      if (error.response?.status !== 401) {
        setErr("Failed to load profile");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("accessToken");
    setProfile(null);
    window.location.href = `/guest?tableId=${tableId || ""}`;
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setErr(null);
    setMsg(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
      };
      const res = await api.patch("/auth/profile", payload);
      setProfile(res.data);
      setMsg(t("profile.updateSuccess") || "Profile updated successfully");
    } catch (e: any) {
      const message = e?.response?.data?.message || "Update failed";
      setErr(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setErr(null);
    setMsg(null);

    if (!pw.currentPassword || !pw.newPassword) {
      setErr(t("profile.pwRequired") || "Please fill in all password fields");
      return;
    }
    if (pw.newPassword.length < 8) {
      setErr(
        t("profile.pwMin") || "New password must be at least 8 characters",
      );
      return;
    }
    if (pw.newPassword !== pw.confirmNewPassword) {
      setErr(
        t("profile.pwMismatch") || "New password confirmation does not match",
      );
      return;
    }

    setSavingPassword(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setMsg(t("profile.pwChanged") || "Password changed successfully");
      setPw({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (e: any) {
      const message = e?.response?.data?.message || "Change password failed";
      setErr(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setErr(null);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);

      // bust cache a bit (optional)
      setMsg(t("profile.avatarUpdated") || "Avatar updated successfully");
    } catch (e: any) {
      const message = e?.response?.data?.message || "Upload avatar failed";
      setErr(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setUploading(false);
    }
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
        <Header
          title={t("profile.title")}
          showBack
          backUrl={`/guest?tableId=${tableId || ""}`}
          tableId={tableId}
        />
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("profile.notLoggedIn")}
          </h2>
          <p className="text-gray-500">{t("profile.notLoggedInDesc")}</p>
          <Link
            href="/login"
            className="w-full max-w-xs bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors"
          >
            {t("profile.loginRegister")}
          </Link>
        </div>
      </>
    );
  }

  // If backend returns absolute url, use it directly.
  // If backend returns relative url, prefix with apiBase.
  const avatarSrc = profile.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
      : `${apiBase}${profile.avatar}`
    : null;

  return (
    <>
      <Header
        title={t("profile.title")}
        showBack
        backUrl={`/guest?tableId=${tableId || ""}`}
        tableId={tableId}
      />

      <div className="p-4 safe-area-pb space-y-4">
        {/* Messages */}
        {(msg || err) && (
          <div
            className={`p-3 rounded-xl text-sm font-medium ${
              err
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
          >
            {err || msg}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-3">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow flex items-center justify-center">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={profile.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">
                    {(profile.name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <label
                className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 border-white shadow cursor-pointer ${
                  uploading
                    ? "bg-gray-300 text-gray-600"
                    : "bg-orange-600 text-white"
                }`}
                title={t("profile.uploadAvatar") || "Upload avatar"}
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) =>
                    handleAvatarUpload(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            {profile.phone && (
              <p className="text-gray-500 text-sm">{profile.phone}</p>
            )}
          </div>

          {/* Edit form */}
          <div className="mt-5 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("profile.name") || "Name"}
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("profile.email") || "Email"}
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="abc@gmail.com"
              />
              <div className="text-xs text-gray-400 mt-1">
                {t("profile.emailNote") ||
                  "If you change email, you may need to verify again."}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("profile.phone") || "Phone"}
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={form.phone}
                onChange={(e) =>
                  setForm((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="090xxxxxxx"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className={`w-full font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 ${
                savingProfile
                  ? "bg-gray-300 text-gray-700"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              <Save className="w-5 h-5" />
              {savingProfile
                ? t("common.saving") || "Saving..."
                : t("profile.save") || "Save changes"}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-gray-800">
              {t("profile.changePassword") || "Change password"}
            </h3>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder={t("profile.currentPassword") || "Current password"}
              value={pw.currentPassword}
              onChange={(e) =>
                setPw((s) => ({ ...s, currentPassword: e.target.value }))
              }
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder={
                t("profile.newPassword") || "New password (min 8 chars)"
              }
              value={pw.newPassword}
              onChange={(e) =>
                setPw((s) => ({ ...s, newPassword: e.target.value }))
              }
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder={
                t("profile.confirmNewPassword") || "Confirm new password"
              }
              value={pw.confirmNewPassword}
              onChange={(e) =>
                setPw((s) => ({ ...s, confirmNewPassword: e.target.value }))
              }
            />

            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className={`w-full font-bold py-3 rounded-xl shadow-sm ${
                savingPassword
                  ? "bg-gray-300 text-gray-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {savingPassword
                ? t("common.saving") || "Saving..."
                : t("profile.updatePassword") || "Update password"}
            </button>
          </div>
        </div>

        {/* Menu Options (kept) */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <MenuItem
            icon={<Award className="w-5 h-5" />}
            label="Điểm Tích Lũy & Voucher"
            href="/guest/loyalty"
          />
          <MenuItem
            icon={<History className="w-5 h-5" />}
            label={t("profile.menu.orderHistory")}
            href="#"
          />
          <MenuItem
            icon={<Heart className="w-5 h-5" />}
            label={t("profile.menu.favorites")}
            href="#"
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            label={t("profile.menu.settings")}
            href="#"
          />
          <MenuItem
            icon={<HelpCircle className="w-5 h-5" />}
            label={t("profile.menu.help")}
            href="#"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          {t("common.logout")}
        </button>

        <div className="text-center text-xs text-gray-400 py-4">
          {t("profile.version")} 1.0.0
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
