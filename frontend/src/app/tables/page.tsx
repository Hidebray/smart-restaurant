"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TableItem {
  id: string;
  tableNumber: string;
  capacity: number;
  location?: string;
  status?: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
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

        // Generate QR codes for each table (backend returns dataURL)
        const map: Record<string, string> = {};
        await Promise.all(
          (data || []).map(async (t: any) => {
            try {
              const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/tables/${t.id}/generate-qr`, { method: "POST" });
              if (!r.ok) return;
              const json = await r.json();
              map[t.id] = json.qrCodeDataUrl;
            } catch (e) {
              // ignore per-item errors
            }
          })
        );

        setQrMap(map);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">QR Codes for Tables</h1>

        {tables.length === 0 ? (
          <div>No tables found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tables.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">Bàn {t.tableNumber}</div>
                    <div className="text-sm text-gray-600">Sức chứa: {t.capacity}</div>
                  </div>
                  <div className="text-sm text-gray-600">{t.status}</div>
                </div>

                <div className="mb-4 flex items-center justify-center">
                  {qrMap[t.id] ? (
                    // Clicking the image navigates to the guest menu with tableId
                    <Link href={`/guest?tableId=${t.id}`}>
                      <img src={qrMap[t.id]} alt={`QR ${t.tableNumber}`} className="w-40 h-40 object-contain" />
                    </Link>
                  ) : (
                    <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-sm text-gray-600">No QR</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/guest?tableId=${t.id}`} className="flex-1 text-center bg-blue-600 text-white py-2 rounded">Open Menu</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
