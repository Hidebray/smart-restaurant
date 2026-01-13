import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  totalAmount: number;

  addToCart: (product: Product, quantity: number, modifiers: any[]) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      
      addToCart: (product, quantity, modifiers) => {
        const currentItems = get().items;
        
        const modifierTotal = modifiers.reduce((sum, mod) => sum + Number(mod.price), 0);
        const unitPrice = Number(product.price) + modifierTotal;
        const finalPrice = unitPrice * quantity;
        
        const existingItemIndex = currentItems.findIndex(item => {
            const itemModsString = JSON.stringify(item.modifiers.map(m => m.modifierOptionId).sort());
            const newItemModsString = JSON.stringify(modifiers.map(m => m.modifierOptionId).sort());
            return item.productId === product.id && newItemModsString === itemModsString;
        });

        let newItems = [...currentItems];

        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += quantity;
          newItems[existingItemIndex].totalPrice += finalPrice;
        } else {
            const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images.find(img => img.isPrimary)?.url,
            quantity: quantity,
            modifiers: modifiers,
            totalPrice: finalPrice
          };
          newItems.push(newItem);
        }

        const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
        set({ items: newItems, totalAmount: newTotalAmount });
      },

      removeFromCart: (index) => {
        const currentItems = get().items;
        const newItems = currentItems.filter((_, i) => i != index);
        const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
        set({ items: newItems, totalAmount: newTotalAmount});
      },

      clearCart: () => set({ items: [], totalAmount: 0 }),
    }),
    {
      name: 'smart-restaurant-cart',
    }
  )
);