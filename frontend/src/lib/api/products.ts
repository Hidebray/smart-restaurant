import { api } from "@/lib/api/api";
import type { Product } from "@/types";

export type AdminProductUpsertPayload = {
  name: string;
  description?: string | null;
  allergens?: string | null;
  price: number | string;
  status?: "AVAILABLE" | "UNAVAILABLE" | "SOLD_OUT";
  categoryName: string;
  imageUrl?: string | null;
  isChefRecommended?: boolean;
  prepTimeMinutes?: number | null;
};

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/products", {
      params: { includeAll: true },
    });
    return response.data;
  },

  getAllAdmin: (params?: { sortBy?: string; sortDir?: string }) =>
    api.get("/products/admin", { params }).then((r) => r.data),

  getById: async (id: string): Promise<Product> =>
    api.get(`/products/${id}`).then((r) => r.data),

  create: async (payload: AdminProductUpsertPayload): Promise<Product> => {
    const response = await api.post("/products", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<AdminProductUpsertPayload>,
  ): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  uploadImages: (
    productId: string,
    files: File[],
    opts?: { setPrimaryFirst?: boolean; replaceAll?: boolean },
  ) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return api
      .post(`/products/${productId}/images`, fd, {
        params: {
          setPrimaryFirst: opts?.setPrimaryFirst ? "true" : "false",
          replaceAll: opts?.replaceAll ? "true" : "false",
        },
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  setPrimaryImage: (productId: string, imageId: string) =>
    api
      .patch(`/products/${productId}/images/${imageId}/primary`)
      .then((r) => r.data),

  deleteImage: (productId: string, imageId: string) =>
    api.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data),
};
