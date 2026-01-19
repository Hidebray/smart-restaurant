export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type PointsTransactionType = 'EARN' | 'REDEEM' | 'EXPIRED' | 'ADJUSTMENT';

export interface LoyaltyPoints {
  id: string;
  userId: string;
  points: number;
  tier: LoyaltyTier;
  totalEarned: number;
  totalRedeemed: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  points: number;
  type: PointsTransactionType;
  description?: string;
  orderId?: string;
  order?: {
    id: string;
    totalAmount: number;
    createdAt: string;
  };
  createdAt: string;
}

export interface PointsHistoryResponse {
  transactions: PointsTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherRedemption {
  id: string;
  userId: string;
  voucherId: string;
  orderId: string;
  discountAmount: number;
  redeemedAt: string;
}

export interface RedeemVoucherResponse {
  voucher: Voucher;
  discountAmount: number;
}

export interface VoucherStats {
  total: number;
  active: number;
  expired: number;
  totalRedemptions: number;
}
