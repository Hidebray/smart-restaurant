"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { Users, ArrowLeft, QrCode } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface TableItem {
  id: string;
  tableNumber: string;
  capacity: number;
  location?: string;
  status?: string;
}

function TablesContent() {
  const { t } = useI18n();
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/tables`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch tables");
        const data = await res.json();
        setTables(data || []);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-gray-500">{t('tables.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t('tables.error')}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] pb-safe">
      {/* Mobile Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm border-b border-gray-100">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg text-gray-800">{t('tables.title')}</h1>
        <LanguageSwitcher />
      </div>

      <div className="p-4">
        <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100 mb-6">
          <QrCode className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            {t('tables.subtitle')}
          </p>
        </div>

        {tables.length === 0 ? (
          <div className="text-center py-12 text-slate-500">{t('tables.empty')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {tables.map((table) => (
              <Link
                key={table.id}
                href={`/guest?tableId=${table.id}`}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all hover:shadow-md flex flex-col items-center text-center group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold border ${table.status === 'AVAILABLE' ? 'bg-green-100 text-green-900 border-green-300' :
                  table.status === 'OCCUPIED' ? 'bg-red-100 text-red-900 border-red-300' : 'bg-gray-200 text-gray-900 border-gray-400'
                  }`}>
                  {table.status === 'AVAILABLE' ? t('tables.available') : table.status === 'OCCUPIED' ? t('tables.occupied') : table.status}
                </div>

                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <span className="text-2xl font-bold">{table.tableNumber}</span>
                </div>

                <div className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                  <Users className="w-3 h-3" />
                  <span>{t('tables.capacity', { capacity: table.capacity })}</span>
                </div>

                <button className="w-full py-2 px-3 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {t('tables.selectTable')}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default function TablesPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <TablesContent />
      </Suspense>
    </main>
  )
}
