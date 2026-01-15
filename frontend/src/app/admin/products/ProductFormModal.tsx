"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Product } from "@/types";
import {
  productsApi,
  type AdminProductUpsertPayload,
} from "@/lib/api/products";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      status: "AVAILABLE",
      categoryName: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!product) {
      reset({
        name: "",
        description: "",
        price: "",
        status: "AVAILABLE",
        categoryName: "",
        imageUrl: "",
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
    });
  }, [open, product, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload: AdminProductUpsertPayload = {
      name: values.name,
      description: values.description || null,
      price: values.price,
      status: values.status,
      categoryName: values.categoryName,
      imageUrl: values.imageUrl || null,
    };

    if (product) {
      await productsApi.update(product.id, payload);
    } else {
      await productsApi.create(payload);
    }

    onClose(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose(false))}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Name</label>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="Spicy Chicken Wings"
              />
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
                placeholder="45000"
              />
              {errors.price && (
                <div className="text-xs text-red-600">
                  {errors.price.message}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Description</label>
            <Input
              {...register("description")}
              placeholder="Optional description..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Category Name</label>
              <Input
                {...register("categoryName", {
                  required: "Category name is required",
                })}
                placeholder="Drinks / Food / Dessert"
              />
              {errors.categoryName && (
                <div className="text-xs text-red-600">
                  {errors.categoryName.message}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Status</label>
              <select
                {...register("status")}
                className="h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Primary Image URL</label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            <div className="text-xs text-gray-600">
              Nếu bỏ trống, hệ thống sẽ dùng hình mặc định trên menu.
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
