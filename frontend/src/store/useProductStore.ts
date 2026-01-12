import { create } from 'zustand';
import { Product, Category } from '@/types';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Gọi xuống API backend mà chúng ta đã viết ở Phase 3
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data: Product[] = await res.json();
      
      // Tự động lọc ra danh sách Categories từ sản phẩm
      const categoryMap = new Map();
      data.forEach(p => {
        if (p.category) {
          categoryMap.set(p.category.id, p.category);
        }
      });
      
      const categories = Array.from(categoryMap.values()).sort((a, b) => a.displayOrder - b.displayOrder);

      set({ products: data, categories, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Không tải được thực đơn', isLoading: false });
    }
  },
}));