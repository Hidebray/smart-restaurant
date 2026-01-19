"use client";

import Image from "next/image";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

function formatPrice(price: string | number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
}

const statusBadge: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-900 border border-green-300",
  UNAVAILABLE: "bg-gray-200 text-gray-900 border border-gray-400",
  SOLD_OUT: "bg-red-100 text-red-900 border border-red-300",
};

const STATUS_KEYS: Record<string, string> = {
  AVAILABLE: "statusAvailable",
  UNAVAILABLE: "statusUnavailable",
  SOLD_OUT: "statusSoldOut",
};

import { useI18n } from "@/contexts/I18nContext";

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => Promise<void> | void;
}) {
  const { t } = useI18n();

  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 text-center">
        {t('menu.noItems') || "No products found."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="grid grid-cols-12 gap-3 border-b bg-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-800">
        <div className="col-span-5">{t('common.name') || "Product"}</div>
        <div className="col-span-3">{t('admin.categories') || "Category"}</div>
        <div className="col-span-2">{t('common.price') || "Price"}</div>
        <div className="col-span-1">{t('common.status') || "Status"}</div>
        <div className="col-span-1 text-right">{t('common.actions') || "Actions"}</div>
      </div>

      {products.map((p) => {
        const primary = p.images?.find((i) => i.isPrimary)?.url;
        return (
          <div
            key={p.id}
            className="grid grid-cols-12 gap-3 px-4 py-3 items-center border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-gray-100 flex-shrink-0">
                <Image
                  src={
                    primary ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {p.name}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {p.description || t('common.noDescription') || "No description"}
                </div>
              </div>
            </div>

            <div className="col-span-3 text-sm text-gray-700 truncate">
              {p.category?.name || "—"}
            </div>
            <div className="col-span-2 text-sm font-semibold text-gray-900">
              {formatPrice(p.price as any)}
            </div>

            <div className="col-span-1">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusBadge[p.status] || "bg-gray-100 text-gray-900 border border-gray-300"
                  }`}
              >
                {t(`menu.${STATUS_KEYS[p.status] || 'statusAvailable'}`) || p.status}
              </span>
            </div>

            <div className="col-span-1 flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(p)}
                title={t('common.edit')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (confirm(t('common.confirmDelete', { name: p.name }) || `Delete "${p.name}"?`)) onDelete(p.id);
                }}
                title={t('common.delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
