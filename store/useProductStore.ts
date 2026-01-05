
import { create } from 'zustand';
import { Product, ProductStatus } from '../types';
import { products as initialProducts } from '../data/mockData';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStatus: (productId: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: initialProducts,
  addProduct: (productData) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      ...productData,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: (updatedProduct) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    }));
  },
  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },
  toggleProductStatus: (productId: string) => {
    set((state) => ({
        products: state.products.map((p) =>
            p.id === productId ? { ...p, status: p.status === ProductStatus.AVAILABLE ? ProductStatus.SOLD_OUT : ProductStatus.AVAILABLE } : p
        )
    }))
  }
}));
