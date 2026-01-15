"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { productsApi } from "@/lib/api/products";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as Icons from "lucide-react";
import ProductList from "./ProductList";
import ProductFormModal from "./ProductFormModal";

const fetcher = () => productsApi.getAll();

export default function ProductsPage() {
  const {
    data: products,
    error,
    mutate,
  } = useSWR<Product[]>("admin_products", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category?.name, p.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [products, query]);

  const openAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setSelected(p);
    setIsModalOpen(true);
  };

  const closeModal = async (shouldRefresh = false) => {
    setIsModalOpen(false);
    setSelected(null);
    if (shouldRefresh) await mutate();
  };

  if (error) return <div className="p-4">Failed to load products</div>;
  if (!products) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-sm text-gray-700">
            Tạo / sửa / xoá món ăn, đồ uống trực tiếp trên dashboard.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={openAdd}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
        <Icons.Search className="h-4 w-4 text-gray-600" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, category, status..."
          className="border-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0"
        />
      </div>

      <ProductList
        products={filtered}
        onEdit={openEdit}
        onDelete={async (id) => {
          await productsApi.remove(id);
          await mutate();
        }}
      />

      <ProductFormModal
        open={isModalOpen}
        product={selected}
        onClose={closeModal}
      />
    </div>
  );
}
