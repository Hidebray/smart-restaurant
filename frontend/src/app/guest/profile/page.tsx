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
  X,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Edit2,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

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
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
}) {
  const content = (
    <>
      <span className="text-slate-500">{icon}</span>
      <span className="font-medium text-gray-700 flex-1">{label}</span>
      {badge && (
        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      {content}
    </Link>
  );
}

function ProfileContent() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password visibility states
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        toast.error("Failed to load profile");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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

    if (!form.name.trim()) {
      toast.error(t("profile.nameRequired") || "Name is required");
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error(t("profile.emailInvalid") || "Invalid email format");
      return;
    }

    if (form.phone && !/^\d{10,11}$/.test(form.phone)) {
      toast.error(t("profile.phoneInvalid") || "Invalid phone format (10-11 digits)");
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
      };
      const res = await api.patch("/auth/profile", payload);
      setProfile(res.data);
      toast.success(t("profile.updateSuccess") || "Profile updated successfully");
      setShowEditModal(false);
    } catch (e: any) {
      const message = e?.response?.data?.message || "Update failed";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
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
      setShowPasswordModal(false);
    } catch (e: any) {
      const message = e?.response?.data?.message || "Change password failed";
      // Map common English backend errors to translated messages
      if (message.includes("Current password is incorrect") || message.includes("incorrect")) {
        toast.error(t("profile.pwIncorrect") || "Mật khẩu hiện tại không đúng");
      } else {
        toast.error(Array.isArray(message) ? message.join(", ") : message);
      }
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
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
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center text-orange-400 mb-2">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("profile.notLoggedIn")}
          </h2>
          <p className="text-gray-500">{t("profile.notLoggedInDesc")}</p>
          <Link
            href="/login"
            className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all text-center"
          >
            {t("profile.loginRegister")}
          </Link>
        </div>
      </>
    );
  }

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
        {/* Profile Card - Clean display only */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-20 h-20 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-white/20 ring-4 ring-white/70 shadow-lg flex items-center justify-center">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={profile.name || "User"}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white/80">
                    {(profile.name || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <label
                className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white shadow cursor-pointer ${uploading ? "bg-gray-400" : "bg-white"
                  }`}
              >
                <Camera className={`w-3 h-3 ${uploading ? "text-gray-600" : "text-orange-600"}`} />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profile.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-white/80 text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-1.5 mt-0.5 text-white/80 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.isEmailVerified && (
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="w-3 h-3 text-green-300" />
                  <span className="text-xs text-green-200">Email đã xác thực</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <MenuItem
            icon={<Edit2 className="w-5 h-5" />}
            label={t("profile.editProfile") || "Chỉnh sửa thông tin"}
            onClick={() => setShowEditModal(true)}
          />
          <MenuItem
            icon={<KeyRound className="w-5 h-5" />}
            label={t("profile.changePassword") || "Đổi mật khẩu"}
            onClick={() => setShowPasswordModal(true)}
          />
        </div>

        {/* Other Menu Options */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <MenuItem
            icon={<Award className="w-5 h-5" />}
            label={t("profile.menu.loyaltyVoucher")}
            href={`/guest/loyalty?tableId=${tableId || ""}`}
          />
          <MenuItem
            icon={<History className="w-5 h-5" />}
            label={t("profile.menu.orderHistory")}
            href={`/guest/profile/orders?tableId=${tableId || ""}`}
          />
          <MenuItem
            icon={<Heart className="w-5 h-5" />}
            label={t("profile.menu.favorites")}
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

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-gray-800">
                {t("profile.editProfile") || "Chỉnh sửa thông tin"}
              </DialogTitle>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.name") || "Họ tên"}
                </label>
                <input
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.email") || "Email"}
                </label>
                <input
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="abc@gmail.com"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t("profile.emailNote") || "Nếu đổi email, bạn cần xác thực lại."}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.phone") || "Số điện thoại"}
                </label>
                <input
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="090xxxxxxx"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${savingProfile
                  ? "bg-gray-300 text-gray-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200"
                  }`}
              >
                <Save className="w-5 h-5" />
                {savingProfile ? t("common.saving") || "Đang lưu..." : t("profile.save") || "Lưu thay đổi"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-gray-800">
                {t("profile.changePassword") || "Đổi mật khẩu"}
              </DialogTitle>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.currentPassword") || "Mật khẩu hiện tại"}
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                    value={pw.currentPassword}
                    onChange={(e) => setPw((s) => ({ ...s, currentPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.newPassword") || "Mật khẩu mới (tối thiểu 8 ký tự)"}
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                    value={pw.newPassword}
                    onChange={(e) => setPw((s) => ({ ...s, newPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {t("profile.confirmNewPassword") || "Xác nhận mật khẩu mới"}
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-900"
                    value={pw.confirmNewPassword}
                    onChange={(e) => setPw((s) => ({ ...s, confirmNewPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className={`w-full font-bold py-3 rounded-xl transition-all ${savingPassword
                  ? "bg-gray-300 text-gray-600"
                  : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
              >
                {savingPassword ? t("common.saving") || "Đang lưu..." : t("profile.updatePassword") || "Đổi mật khẩu"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
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

