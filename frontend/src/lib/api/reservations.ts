import { api } from './api';
import {
  Reservation,
  ReservationStats,
  CreateReservationPayload,
  UpdateReservationPayload,
  ReservationStatus,
} from '@/types/reservation';

export interface GetReservationsParams {
  tableId?: string;
  customerId?: string;
  date?: string;
  status?: ReservationStatus;
  skip?: number;
  take?: number;
}

export const reservationsApi = {
  /**
   * Create a new reservation
   */
  create: async (payload: CreateReservationPayload): Promise<Reservation> => {
    const response = await api.post('/reservations', payload);
    return response.data;
  },

  /**
   * Get all reservations with filters
   */
  getAll: async (params?: GetReservationsParams): Promise<Reservation[]> => {
    const response = await api.get('/reservations', { params });
    return response.data;
  },

  /**
   * Get reservation by ID
   */
  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  /**
   * Update reservation
   */
  update: async (
    id: string,
    payload: UpdateReservationPayload,
  ): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}`, payload);
    return response.data;
  },

  /**
   * Delete reservation
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },

  /**
   * Confirm reservation
   */
  confirm: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/confirm`);
    return response.data;
  },

  /**
   * Cancel reservation
   */
  cancel: async (id: string, reason?: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Complete reservation
   */
  complete: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/complete`);
    return response.data;
  },

  /**
   * Mark reservation as no-show
   */
  markNoShow: async (id: string): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${id}/no-show`);
    return response.data;
  },

  /**
   * Get reservations for a specific date
   */
  getByDate: async (date: string): Promise<Reservation[]> => {
    const response = await api.get(`/reservations/date/${date}`);
    return response.data;
  },

  /**
   * Get upcoming reservations
   */
  getUpcoming: async (limit?: number): Promise<Reservation[]> => {
    const response = await api.get('/reservations/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get reservation statistics
   */
  getStats: async (): Promise<ReservationStats> => {
    const response = await api.get('/reservations/stats');
    return response.data;
  },
};
