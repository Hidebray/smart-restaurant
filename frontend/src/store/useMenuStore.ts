import { create } from 'zustand';
import { Product } from '@/types';

interface MenuStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
    searchQuery: string;
    activeCategory: string;
    setProducts: (products: Product[]) => void;
    setSearchQuery: (query: string) => void;
    setActiveCategory: (category: string) => void;
    fetchProducts: (forceRefresh?: boolean) => Promise<void>;
    searchProducts: (query: string) => Promise<void>;
    reset: () => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    lastFetched: null,
    searchQuery: '',
    activeCategory: '',

    setProducts: (products) => set({ products, lastFetched: Date.now() }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setActiveCategory: (activeCategory) => set({ activeCategory }),

    fetchProducts: async (forceRefresh = false) => {
        const { lastFetched, isLoading, products } = get();
        // Cache for 5 minutes (300000ms) to prevent frequent refetches
        if (!forceRefresh && products.length > 0 && lastFetched && Date.now() - lastFetched < 300000) {
            return;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/products`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            set({ products: data, isLoading: false, lastFetched: Date.now(), searchQuery: '' });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    searchProducts: async (query: string) => {
        const { isLoading } = get();
        if (isLoading) return;

        if (!query.trim()) {
            // If empty query, fetch all products
            return get().fetchProducts(true);
        }

        set({ isLoading: true, error: null, searchQuery: query });
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/products/search?q=${encodeURIComponent(query)}`,
                { cache: 'no-store' }
            );
            if (!res.ok) throw new Error('Failed to search products');
            const data = await res.json();
            set({ products: data, isLoading: false, lastFetched: Date.now() });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    reset: () => set({
        products: [],
        isLoading: false,
        error: null,
        lastFetched: null,
        searchQuery: '',
        activeCategory: ''
    })
}));
