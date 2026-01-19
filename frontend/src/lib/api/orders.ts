import { api } from './api';
import { Order } from '@/types';

export interface CreateOrderPayload {
  tableId: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    modifiers?: { modifierOptionId: string }[];
  }[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload): Promise<Order> => api.post('/orders', payload).then(res => res.data),
  getByTable: (tableId: string): Promise<Order[]> => api.get(`/orders?tableId=${tableId}`).then(res => res.data),
  getAll: (): Promise<Order[]> => api.get('/orders').then(res => res.data),
};
