"use client";

import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { productsApi } from "@/lib/api/products";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as Icons from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import ProductList from "./ProductList";
import ProductFormModal from "./ProductFormModal";

const SORT_KEY = "admin_products_sort";

export default function ProductsPage() {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [query, setQuery] = useState("");

  // ✅ Sort state
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<string>("desc");

  // ✅ Load persisted sort once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SORT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.sortBy) setSortBy(saved.sortBy);
      if (saved?.sortDir) setSortDir(saved.sortDir);
    } catch { }
  }, []);

  // ✅ Persist sort whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(SORT_KEY, JSON.stringify({ sortBy, sortDir }));
    } catch { }
  }, [sortBy, sortDir]);

  // ✅ SWR fetcher uses current sort
  const fetcher = () => productsApi.getAllAdmin({ sortBy, sortDir });

  const {
    data: products,
    error,
    mutate,
  } = useSWR<Product[]>(["admin_products", sortBy, sortDir], fetcher);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      [p.name, (p as any).category?.name, (p as any).status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
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

  if (error) return <div className="p-4">{t('common.error') || "Failed to load products"}</div>;
  if (!products) return <div className="p-4">{t('common.loading') || "Loading..."}</div>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.products') || "Product Management"}</h1>
          <p className="text-sm text-gray-700">
            {t('common.manageProductsDesc') || "Create, edit, and delete food & beverage items directly."}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={openAdd}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" /> {t('common.add') || "Add Product"}
          </Button>
        </div>
      </div>

      {/* ✅ Toolbar: Search + Sort */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 w-full sm:w-auto sm:flex-1">
          <Icons.Search className="h-4 w-4 text-gray-600" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.searchPlaceholder') || "Search by name, category, status..."}
            className="border-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-2 py-2 text-sm bg-white"
            title={t('common.sortBy') || "Sort by"}
          >
            <option value="createdAt">{t('common.sortDate') || "Creation date"}</option>
            <option value="price">{t('common.price') || "Price"}</option>
            <option value="name">{t('common.name') || "Name"}</option>
            <option value="popularity">{t('common.sortPopular') || "Popularity"}</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border border-gray-300 rounded px-2 py-2 text-sm bg-white"
            title={t('common.sortDir') || "Sort direction"}
          >
            <option value="desc">{t('common.desc') || "Desc"}</option>
            <option value="asc">{t('common.asc') || "Asc"}</option>
          </select>
        </div>
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
