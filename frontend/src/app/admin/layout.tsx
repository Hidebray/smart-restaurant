"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { label: t('admin.dashboard'), href: "/admin/dashboard" },
    { label: t('admin.products'), href: "/admin/products" },
    { label: t('admin.categories'), href: "/admin/categories" },
    { label: t('admin.tables'), href: "/admin/tables" },
    { label: t('admin.orders'), href: "/admin/orders" },
    { label: t('admin.modifiers'), href: "/admin/modifiers" },
    { label: t('admin.staff'), href: "/admin/staff" },
    { label: t('admin.profile'), href: "/admin/profile" },
    { label: "Loyalty", href: "/admin/loyalty" },
    { label: "Inventory", href: "/admin/inventory" },
    { label: "Reservations", href: "/admin/reservations" },
    { label: t('admin.reports'), href: "/admin/reports" },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-lg font-semibold border-b border-gray-700">
          {t('admin.dashboard')}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block rounded-md px-4 py-2 transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-3">
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50 text-gray-900">
        {children}
      </main>
    </div>
  );
}
