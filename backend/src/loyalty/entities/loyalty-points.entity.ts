import { LoyaltyTier } from '@prisma/client';

export class LoyaltyPointsEntity {
  id: string;
  userId: string;
  points: number;
  tier: LoyaltyTier;
  totalEarned: number;
  totalRedeemed: number;
  createdAt: Date;
  updatedAt: Date;
}
