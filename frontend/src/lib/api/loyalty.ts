import { api } from './api';
import {
  LoyaltyPoints,
  PointsHistoryResponse,
  Voucher,
  RedeemVoucherResponse,
  VoucherStats,
} from '@/types/loyalty';

export interface RedeemPointsPayload {
  points: number;
  orderId: string;
}

export interface CreateVoucherPayload {
  code: string;
  name: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export interface UpdateVoucherPayload {
  code?: string;
  name?: string;
  description?: string;
  discountType?: 'PERCENT' | 'FIXED';
  discountValue?: number;
  minOrderAmount?: number;
  maxUses?: number;
  expiryDate?: string;
  isActive?: boolean;
}

export interface GetPointsHistoryParams {
  page?: number;
  limit?: number;
  type?: PointsTransactionType;
}

type PointsTransactionType = 'EARN' | 'REDEEM' | 'EXPIRED' | 'ADJUSTMENT';

export const loyaltyApi = {
  // =========================================================
  // LOYALTY POINTS
  // =========================================================

  /**
   * Get current user's loyalty points
   */
  getMyPoints: async (): Promise<LoyaltyPoints> => {
    const response = await api.get('/loyalty/points');
    return response.data;
  },

  /**
   * Get points history for current user
   */
  getPointsHistory: async (
    params?: GetPointsHistoryParams,
  ): Promise<PointsHistoryResponse> => {
    const response = await api.get('/loyalty/points/history', { params });
    return response.data;
  },

  /**
   * Redeem points for discount
   */
  redeemPoints: async (
    payload: RedeemPointsPayload,
  ): Promise<LoyaltyPoints> => {
    const response = await api.post('/loyalty/points/redeem', payload);
    return response.data;
  },

  /**
   * Get loyalty points for a user (admin only)
   */
  getUserPoints: async (userId: string): Promise<LoyaltyPoints> => {
    const response = await api.get(`/loyalty/points/${userId}`);
    return response.data;
  },

  /**
   * Update user tier (admin only)
   */
  updateUserTier: async (
    userId: string,
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
  ): Promise<LoyaltyPoints> => {
    const response = await api.patch(`/loyalty/points/${userId}/tier`, { tier });
    return response.data;
  },

  /**
   * Add points manually (admin only)
   */
  addPointsManually: async (
    userId: string,
    payload: {
      points: number;
      description?: string;
      orderId?: string;
    },
  ): Promise<LoyaltyPoints> => {
    const response = await api.post(`/loyalty/points/${userId}/add`, payload);
    return response.data;
  },

  // =========================================================
  // VOUCHERS
  // =========================================================

  /**
   * Get available vouchers for current user
   */
  getAvailableVouchers: async (): Promise<Voucher[]> => {
    const response = await api.get('/loyalty/vouchers');
    return response.data;
  },

  /**
   * Get voucher by code
   */
  getVoucherByCode: async (code: string): Promise<Voucher> => {
    const response = await api.get(`/loyalty/vouchers/code/${code}`);
    return response.data;
  },

  /**
   * Redeem voucher for an order
   */
  redeemVoucher: async (
    code: string,
    orderId: string,
  ): Promise<RedeemVoucherResponse> => {
    const response = await api.post('/loyalty/vouchers/redeem', {
      code,
      orderId,
    });
    return response.data;
  },

  /**
   * Get all vouchers (admin only)
   */
  getAllVouchers: async (includeInactive?: boolean): Promise<Voucher[]> => {
    const response = await api.get('/loyalty/vouchers/all', {
      params: { includeInactive },
    });
    return response.data;
  },

  /**
   * Create voucher (admin only)
   */
  createVoucher: async (payload: CreateVoucherPayload): Promise<Voucher> => {
    const response = await api.post('/loyalty/vouchers', payload);
    return response.data;
  },

  /**
   * Update voucher (admin only)
   */
  updateVoucher: async (
    id: string,
    payload: UpdateVoucherPayload,
  ): Promise<Voucher> => {
    const response = await api.patch(`/loyalty/vouchers/${id}`, payload);
    return response.data;
  },

  /**
   * Delete voucher (admin only)
   */
  deleteVoucher: async (id: string): Promise<void> => {
    await api.delete(`/loyalty/vouchers/${id}`);
  },

  /**
   * Get voucher statistics (admin only)
   */
  getVoucherStats: async (): Promise<VoucherStats> => {
    const response = await api.get('/loyalty/vouchers/stats');
    return response.data;
  },
};
