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

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => Promise<void> | void;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="grid grid-cols-12 gap-3 border-b bg-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-800">
        <div className="col-span-5">Product</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {products.map((p) => {
        const primary = p.images?.find((i) => i.isPrimary)?.url;
        return (
          <div
            key={p.id}
            className="grid grid-cols-12 gap-3 px-4 py-3 items-center border-b last:border-b-0"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-gray-100">
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
                  {p.description || "No description"}
                </div>
              </div>
            </div>

            <div className="col-span-3 text-sm text-gray-700">
              {p.category?.name || "—"}
            </div>
            <div className="col-span-2 text-sm font-semibold text-gray-900">
              {formatPrice(p.price as any)}
            </div>

            <div className="col-span-1">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${statusBadge[p.status] || "bg-gray-100 text-gray-900 border border-gray-300"
                  }`}
              >
                {p.status}
              </span>
            </div>

            <div className="col-span-1 flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(p)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (confirm(`Delete "${p.name}"?`)) onDelete(p.id);
                }}
                title="Delete"
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
