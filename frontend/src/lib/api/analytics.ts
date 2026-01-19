import { api } from './api';
import {
  DashboardAnalytics,
  RevenueAnalytics,
  CustomerAnalytics,
  ProductAnalytics,
  TableAnalytics,
  ReservationAnalytics,
  AnalyticsSnapshot,
  GetAnalyticsParams,
} from '@/types/analytics';

export const analyticsApi = {
  /**
   * Get comprehensive dashboard analytics
   */
  getDashboard: async (params?: GetAnalyticsParams): Promise<DashboardAnalytics> => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  /**
   * Get revenue analytics
   */
  getRevenue: async (params?: GetAnalyticsParams): Promise<RevenueAnalytics> => {
    const response = await api.get('/analytics/revenue', { params });
    return response.data;
  },

  /**
   * Get customer analytics
   */
  getCustomers: async (params?: GetAnalyticsParams): Promise<CustomerAnalytics> => {
    const response = await api.get('/analytics/customers', { params });
    return response.data;
  },

  /**
   * Get product analytics
   */
  getProducts: async (params?: GetAnalyticsParams): Promise<ProductAnalytics> => {
    const response = await api.get('/analytics/products', { params });
    return response.data;
  },

  /**
   * Get table analytics
   */
  getTables: async (params?: GetAnalyticsParams): Promise<TableAnalytics> => {
    const response = await api.get('/analytics/tables', { params });
    return response.data;
  },

  /**
   * Get reservation analytics
   */
  getReservations: async (params?: GetAnalyticsParams): Promise<ReservationAnalytics> => {
    const response = await api.get('/analytics/reservations', { params });
    return response.data;
  },

  /**
   * Get historical snapshots
   */
  getSnapshots: async (limit?: number): Promise<AnalyticsSnapshot[]> => {
    const response = await api.get('/analytics/snapshots', { params: { limit } });
    return response.data;
  },
};
