"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { Product } from "@/types";
import {
  productsApi,
  type AdminProductUpsertPayload,
} from "@/lib/api/products";
import {
  modifiersApi,
  ModifierGroupWithWithOptions,
} from "@/lib/api/modifiers";
import { categoriesApi, Category } from "@/lib/api/categories";
import { useI18n } from "@/contexts/I18nContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as Icons from "lucide-react";

type FormValues = {
  name: string;
  description: string;
  allergens: string;
  price: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "SOLD_OUT";
  categoryName: string;
  imageUrl: string;
  modifierGroupIds: string[];
  isChefRecommended: boolean;
  prepTimeMinutes: string;
};

export default function ProductFormModal({
  open,
  product,
  onClose,
}: {
  open: boolean;
  product: Product | null;
  onClose: (shouldRefresh?: boolean) => void;
}) {
  const { t } = useI18n();
  const { data: modifierGroups } = useSWR<ModifierGroupWithWithOptions[]>(
    "modifiers",
    modifiersApi.getAllGroups,
  );

  const { data: categories } = useSWR<Category[]>(
    "categories",
    categoriesApi.getAll
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      allergens: "",
      price: "",
      status: "AVAILABLE",
      categoryName: "",
      imageUrl: "",
      modifierGroupIds: [],
      isChefRecommended: false,
      prepTimeMinutes: "",
    },
  });

  /* ================= Image helpers ================= */
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const imgUrl = (u?: string | null) => {
    if (!u) return "";
    return u.startsWith("http") ? u : `${API_BASE}${u}`;
  };

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  /* ================= Reset form when open ================= */
  useEffect(() => {
    if (!open) return;

    setPendingFiles([]);

    if (!product) {
      reset({
        name: "",
        description: "",
        allergens: "",
        price: "",
        status: "AVAILABLE",
        categoryName: "",
        imageUrl: "",
        modifierGroupIds: [],
        isChefRecommended: false,
        prepTimeMinutes: "",
      });
      return;
    }

    const primaryImage = product.images?.find((i) => i.isPrimary)?.url ?? "";

    reset({
      name: product.name,
      description: product.description ?? "",
      allergens: product.allergens ?? "",
      price: String(product.price ?? ""),
      status: product.status,
      categoryName: product.category?.name ?? "",
      imageUrl: primaryImage,
      modifierGroupIds:
        product.modifierGroups?.map((pmg) => pmg.modifierGroupId) || [],
      isChefRecommended: product.isChefRecommended || false,
      prepTimeMinutes: product.prepTimeMinutes ? String(product.prepTimeMinutes) : "",
    });
  }, [open, product, reset]);

  /* ================= Submit ================= */
  const onSubmit = async (values: FormValues) => {
    const payload: AdminProductUpsertPayload = {
      name: values.name,
      description: values.description || null,
      allergens: values.allergens || null,
      price: values.price,
      status: values.status,
      categoryName: values.categoryName,
      imageUrl: values.imageUrl || null,
      isChefRecommended: values.isChefRecommended,
      prepTimeMinutes: values.prepTimeMinutes ? Number(values.prepTimeMinutes) : null,
    };

    try {
      let savedProduct: Product;

      if (product) {
        savedProduct = await productsApi.update(product.id, payload);
      } else {
        savedProduct = await productsApi.create(payload);
      }

      await modifiersApi.updateProductModifierGroups(
        savedProduct.id,
        values.modifierGroupIds,
      );

      /* ✅ Upload multiple images */
      if (pendingFiles.length > 0) {
        await productsApi.uploadImages(savedProduct.id, pendingFiles);
        setPendingFiles([]);
      }

      onClose(true);
    } catch (error: any) {
      console.error("Product form error:", error);
      alert(
        `Error: ${error.response?.data?.message ||
        error.message ||
        t('common.error') || "Failed to save product"
        }`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose(false) : null)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? (t('admin.products') + " - " + t('common.edit')) : (t('admin.products') + " - " + t('common.add'))}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ================= Basic info ================= */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('common.name')}</label>
              <Input {...register("name", { required: t('common.requiredField') || "Name is required" })} />
              {errors.name && (
                <div className="text-xs text-red-600">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('common.price')} (VND)</label>
              <Input
                {...register("price", {
                  required: t('common.requiredField') || "Price is required",
                  validate: (v) => (Number(v) > 0 ? true : "Price must be > 0"),
                })}
              />
              {errors.price && (
                <div className="text-xs text-red-600">
                  {errors.price.message}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('common.prepTime') || "Prep Time"} (minutes)</label>
              <Input
                type="number"
                {...register("prepTimeMinutes", {
                  min: { value: 0, message: "Must be >= 0" }
                })}
              />
              {errors.prepTimeMinutes && (
                <div className="text-xs text-red-600">
                  {errors.prepTimeMinutes.message}
                </div>
              )}
            </div>
            <div className="space-y-1"></div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('common.allergens')} (comma separated)</label>
            <Input
              {...register("allergens")}
              placeholder="e.g., Milk, Eggs, Nuts"
            />
          </div>

          {/* ================= Images ================= */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t('common.images') || "Images"}</h3>

              <label className="text-sm px-3 py-2 rounded border bg-white cursor-pointer">
                {t('common.uploadImages') || "Upload images"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setPendingFiles((prev) => [...prev, ...files]);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {/* Pending upload */}
            {pendingFiles.length > 0 && (
              <div className="mt-3 rounded border p-3 bg-gray-50">
                <div className="text-sm font-medium mb-2">
                  {t('common.pendingUpload') || "Pending upload"} ({pendingFiles.length})
                </div>
                <div className="flex gap-2 flex-wrap">
                  {pendingFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      {f.name}
                      <button
                        type="button"
                        className="ml-2 text-red-600"
                        onClick={() =>
                          setPendingFiles((p) => p.filter((_, i) => i !== idx))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {product?.images?.length ? (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.images.map((img: any) => (
                  <div
                    key={img.id}
                    className="border rounded-lg overflow-hidden bg-white"
                  >
                    <div className="aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl(img.url)}
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 flex gap-2">
                      <button
                        type="button"
                        className={`text-xs px-2 py-1 rounded border ${img.isPrimary ? "bg-black text-white" : "bg-white"
                          }`}
                        onClick={async () => {
                          if (!product?.id) return;
                          await productsApi.setPrimaryImage(product.id, img.id);
                          onClose(true);
                        }}
                      >
                        {img.isPrimary ? (t('common.primary') || "Primary") : (t('common.setPrimary') || "Set primary")}
                      </button>

                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded border text-red-600"
                        onClick={async () => {
                          if (!product?.id) return;
                          await productsApi.deleteImage(product.id, img.id);
                          onClose(true);
                        }}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-500">{t('common.noImages') || "No images yet."}</div>
            )}
          </div>

          {/* ================= Other fields ================= */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('common.description')}</label>
            <Input {...register("description")} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('admin.categories') || "Category"}</label>
              <select
                {...register("categoryName", {
                  required: t('common.requiredField') || "Category is required",
                })}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">{t('common.selectCategory') || "Select a category"}</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryName && (
                <div className="text-xs text-red-600">
                  {errors.categoryName.message}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">{t('common.status')}</label>
              <select
                {...register("status")}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="AVAILABLE">{t('menu.statusAvailable') || "AVAILABLE"}</option>
                <option value="UNAVAILABLE">{t('menu.statusUnavailable') || "UNAVAILABLE"}</option>
                <option value="SOLD_OUT">{t('menu.statusSoldOut') || "SOLD_OUT"}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="isChefRecommended"
                {...register("isChefRecommended")}
                className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isChefRecommended" className="flex items-center gap-2 text-sm font-semibold select-none cursor-pointer">
                <Icons.ChefHat className="w-4 h-4 text-orange-600" />
                {t('menu.chefsChoice') || "Chef Recommended"}
              </label>
            </div>
          </div>


          <div className="space-y-1">
            <label className="text-sm font-semibold">
              {t('common.primaryImageUrl') || "Primary Image URL (optional)"}
            </label>
            <Input {...register("imageUrl")} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">{t('admin.modifiers') || "Modifier Groups"}</label>
            <div className="grid grid-cols-2 gap-2">
              {modifierGroups?.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={group.id}
                    {...register("modifierGroupIds")}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>{group.name}</span>
                </label>
              ))}
              {(!modifierGroups || modifierGroups.length === 0) && (
                <span className="text-sm text-gray-500 col-span-2 italic">
                  {t('common.noModifiers') || "No modifier groups available."}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (t('common.saving') || "Saving...") : (t('common.save') || "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}
