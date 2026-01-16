import { api } from './api';
import { Order } from '@/types';

export interface CreateOrderPayload {
  tableId: string;
  items: {
    productId: string;
    quantity: number;
    modifiers?: { modifierOptionId: string }[];
  }[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload): Promise<Order> => api.post('/orders', payload),
};
