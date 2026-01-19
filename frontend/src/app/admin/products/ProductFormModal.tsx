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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type FormValues = {
  name: string;
  description: string;
  price: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "SOLD_OUT";
  categoryName: string;
  imageUrl: string;
  modifierGroupIds: string[];
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
  const { data: modifierGroups } = useSWR<ModifierGroupWithWithOptions[]>(
    "modifiers",
    modifiersApi.getAllGroups,
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
      price: "",
      status: "AVAILABLE",
      categoryName: "",
      imageUrl: "",
      modifierGroupIds: [],
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
        price: "",
        status: "AVAILABLE",
        categoryName: "",
        imageUrl: "",
        modifierGroupIds: [],
      });
      return;
    }

    const primaryImage = product.images?.find((i) => i.isPrimary)?.url ?? "";

    reset({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price ?? ""),
      status: product.status,
      categoryName: product.category?.name ?? "",
      imageUrl: primaryImage,
      modifierGroupIds:
        product.modifierGroups?.map((pmg) => pmg.modifierGroupId) || [],
    });
  }, [open, product, reset]);

  /* ================= Submit ================= */
  const onSubmit = async (values: FormValues) => {
    const payload: AdminProductUpsertPayload = {
      name: values.name,
      description: values.description || null,
      price: values.price,
      status: values.status,
      categoryName: values.categoryName,
      imageUrl: values.imageUrl || null,
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
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Failed to save product"
        }`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose(false) : null)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ================= Basic info ================= */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Name</label>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && (
                <div className="text-xs text-red-600">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Price (VND)</label>
              <Input
                {...register("price", {
                  required: "Price is required",
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

          {/* ================= Images ================= */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Images</h3>

              <label className="text-sm px-3 py-2 rounded border bg-white cursor-pointer">
                Upload images
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
                  Pending upload ({pendingFiles.length})
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
                        className={`text-xs px-2 py-1 rounded border ${
                          img.isPrimary ? "bg-black text-white" : "bg-white"
                        }`}
                        onClick={async () => {
                          if (!product?.id) return;
                          await productsApi.setPrimaryImage(product.id, img.id);
                          onClose(true);
                        }}
                      >
                        {img.isPrimary ? "Primary" : "Set primary"}
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
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-500">No images yet.</div>
            )}
          </div>

          {/* ================= Other fields ================= */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">Description</label>
            <Input {...register("description")} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Category Name</label>
              <Input
                {...register("categoryName", {
                  required: "Category name is required",
                })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Status</label>
              <select
                {...register("status")}
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">
              Primary Image URL (optional)
            </label>
            <Input {...register("imageUrl")} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Modifier Groups</label>
            <div className="grid grid-cols-2 gap-2">
              {modifierGroups?.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <input
                    type="checkbox"
                    value={group.id}
                    {...register("modifierGroupIds")}
                  />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
