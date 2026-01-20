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
  voucherCode?: string;
  customerId?: string;
  pointsToRedeem?: number;
}

export const ordersApi = {
  create: (payload: CreateOrderPayload): Promise<Order> => api.post('/orders', payload).then(res => res.data),
  getByTable: (tableId: string): Promise<Order[]> => api.get(`/orders?tableId=${tableId}`).then(res => res.data),
  getAll: (): Promise<Order[]> => api.get('/orders').then(res => res.data),
  updateStatus: (id: string, status: string): Promise<Order> => api.patch(`/orders/${id}/status`, { status }).then(res => res.data),
};
