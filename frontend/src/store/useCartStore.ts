import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Giúp lưu giỏ hàng khi F5
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, modifiers: any[]) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addToCart: (product, quantity, modifiers) => {
        const currentItems = get().items;
        
        // Tính giá: Giá gốc + Giá topping
        const modifierTotal = modifiers.reduce((sum, mod) => sum + Number(mod.price), 0);
        const unitPrice = Number(product.price) + modifierTotal;
        
        // Kiểm tra xem món này (cùng topping) đã có trong giỏ chưa
        const existingItemIndex = currentItems.findIndex(
          (item) => item.productId === product.id 
          // (Tạm thời so sánh đơn giản, thực tế cần so sánh deep object modifiers)
        );

        let newItems = [...currentItems];

        if (existingItemIndex > -1) {
          // Nếu có rồi thì tăng số lượng
          newItems[existingItemIndex].quantity += quantity;
        } else {
          // Chưa có thì thêm mới
          newItems.push({
            productId: product.id,
            quantity,
            modifiers,
            // Lưu thêm tên để hiển thị cho dễ
            productName: product.name, 
            price: unitPrice 
          } as any);
        }

        // Tính lại tổng tiền cả giỏ
        const newTotal = newItems.reduce((sum, item) => sum + (item as any).price * item.quantity, 0);
        set({ items: newItems, total: newTotal });
      },

      removeFromCart: (productId) => {
        // Tạm thời xóa hết các món có ID này
        const currentItems = get().items;
        const newItems = currentItems.filter(item => item.productId !== productId);
        const newTotal = newItems.reduce((sum, item) => sum + (item as any).price * item.quantity, 0);
        set({ items: newItems, total: newTotal });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'smart-restaurant-cart', // Tên key lưu trong localStorage
    }
  )
);