import { create } from 'zustand';
import { Product } from '@/types';

interface MenuStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    setProducts: (products: Product[]) => void;
    fetchProducts: () => Promise<void>;
    reset: () => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    lastFetched: null,
    setProducts: (products) => set({ products, lastFetched: Date.now() }),

    fetchProducts: async () => {
        const { lastFetched, isLoading, products } = get();
        // Cache for 5 minutes (300000ms) to prevent frequent refetches
        if (products.length > 0 && lastFetched && Date.now() - lastFetched < 300000) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/products`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            set({ products: data, isLoading: false, lastFetched: Date.now() });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    reset: () => set({ products: [], isLoading: false, error: null, lastFetched: null })
}));
