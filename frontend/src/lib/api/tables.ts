
import { api } from '@/lib/api/api';
import { Table } from '@/types/table';

export type CreateTablePayload = {
  tableNumber: string;
  capacity: number;
  location?: string;
};

export const tablesApi = {
  getAll: async (): Promise<Table[]> => {
    const response = await api.get('/tables');
    return response.data;
  },

  getById: async (id: string): Promise<Table> => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  create: async (data: CreateTablePayload): Promise<Table> => {
    // Only send fields that backend accepts
    const payload: CreateTablePayload = {
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      location: data.location,
    };
    const response = await api.post('/tables', payload);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Table, 'id'>>): Promise<Table> => {
    const response = await api.patch(`/tables/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Table> => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },

  generateQrCode: async (id: string): Promise<{ qrCodeDataUrl: string }> => {
    const response = await api.post(`/tables/${id}/generate-qr`);
    return response.data;
  },

  regenerateQrCode: async (id: string): Promise<{ qrCodeDataUrl: string }> => {
    const response = await api.post(`/tables/${id}/regenerate-qr`);
    return response.data;
  },

  assignWaiter: async (tableId: string, waiterId: string | null): Promise<Table> => {
    const response = await api.patch(`/tables/${tableId}/assign-waiter`, { waiterId });
    return response.data;
  },

  getAssignedTables: async (waiterId: string): Promise<Table[]> => {
    const response = await api.get(`/tables?waiterId=${waiterId}`);
    return response.data;
  },
};
