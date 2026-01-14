import { api } from '@/lib/api/api';
import type { Product } from '@/types';

export type AdminProductUpsertPayload = {
  name: string;
  description?: string | null;
  price: number | string;
  status?: 'AVAILABLE' | 'UNAVAILABLE' | 'SOLD_OUT';
  categoryName: string;
  imageUrl?: string | null;
};

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products', {
      params: { includeAll: true },
    });
    return response.data;
  },

  create: async (payload: AdminProductUpsertPayload): Promise<Product> => {
    const response = await api.post('/products', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<AdminProductUpsertPayload>): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
