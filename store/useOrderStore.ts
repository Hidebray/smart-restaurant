
import { create } from 'zustand';
import { Order, OrderStatus, CartItem } from '../types';
import { tables } from '../data/mockData';

interface OrderState {
  orders: Order[];
  addOrder: (cartItems: CartItem[], tableId: string, totalPrice: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  addOrder: (cartItems, tableId, totalPrice) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random()}`,
      tableId,
      tableNumber: table.tableNumber,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({ orders: [...state.orders, newOrder] }));
  },
  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      ),
    }));
  },
}));
