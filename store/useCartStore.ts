
import { create } from 'zustand';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    let updatedItems;
    if (existingItem) {
      updatedItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [...items, { ...product, quantity: 1 }];
    }
    
    set((state) => ({
      items: updatedItems,
      totalItems: state.totalItems + 1,
      totalPrice: state.totalPrice + product.price,
    }));
  },

  removeItem: (productId) => {
    const { items } = get();
    const itemToRemove = items.find((item) => item.id === productId);
    if (!itemToRemove) return;
    
    const updatedItems = items.filter((item) => item.id !== productId);

    set((state) => ({
      items: updatedItems,
      totalItems: state.totalItems - itemToRemove.quantity,
      totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    });
  },

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));
