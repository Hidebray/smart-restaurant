
import { api } from '@/lib/api/api';
import { Table } from '@/types/table'; // I'll need to create this type

export const tablesApi = {
  getAll: async (): Promise<Table[]> => {
    const response = await api.get('/tables');
    return response.data;
  },

  getById: async (id: string): Promise<Table> => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  create: async (data: Omit<Table, 'id'>): Promise<Table> => {
    const response = await api.post('/tables', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Table, 'id'>>): Promise<Table> => {
    const response = await api.patch(`/tables/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },

  generateQrCode: async (id: string): Promise<{ qrCodeDataUrl: string }> => {
    const response = await api.post(`/tables/${id}/generate-qr`);
    return response.data;
  },
};
