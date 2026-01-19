import { api } from './api';
import {
  Inventory,
  InventoryTransaction,
  InventoryStats,
  LowStockAlert,
} from '@/types/inventory';

export interface CreateInventoryPayload {
  productId: string;
  quantity?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
}

export interface UpdateInventoryPayload {
  quantity?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
}

export interface RestockPayload {
  quantity: number;
  reason?: string;
}

export interface AdjustPayload {
  quantity: number;
  reason?: string;
}

export const inventoryApi = {
  /**
   * Get all inventory items
   */
  getAll: async (includeLowStock?: boolean): Promise<Inventory[]> => {
    const response = await api.get('/inventory', {
      params: { includeLowStock },
    });
    return response.data;
  },

  /**
   * Get inventory by product ID
   */
  getByProductId: async (productId: string): Promise<Inventory> => {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: async (): Promise<LowStockAlert[]> => {
    const response = await api.get('/inventory/alerts');
    return response.data;
  },

  /**
   * Get inventory statistics
   */
  getStats: async (): Promise<InventoryStats> => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  /**
   * Create inventory for a product
   */
  create: async (payload: CreateInventoryPayload): Promise<Inventory> => {
    const response = await api.post('/inventory', payload);
    return response.data;
  },

  /**
   * Update inventory
   */
  update: async (
    id: string,
    payload: UpdateInventoryPayload,
  ): Promise<Inventory> => {
    const response = await api.patch(`/inventory/${id}`, payload);
    return response.data;
  },

  /**
   * Delete inventory
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  /**
   * Restock inventory
   */
  restock: async (id: string, payload: RestockPayload): Promise<InventoryTransaction> => {
    const response = await api.post(`/inventory/${id}/restock`, payload);
    return response.data;
  },

  /**
   * Adjust inventory (manual correction)
   */
  adjust: async (id: string, payload: AdjustPayload): Promise<InventoryTransaction> => {
    const response = await api.post(`/inventory/${id}/adjust`, payload);
    return response.data;
  },

  /**
   * Get transaction history
   */
  getTransactionHistory: async (
    id: string,
    limit?: number,
  ): Promise<InventoryTransaction[]> => {
    const response = await api.get(`/inventory/${id}/transactions`, {
      params: { limit },
    });
    return response.data;
  },
};
