import { PointsTransactionType } from '@prisma/client';

export class PointsTransactionEntity {
  id: string;
  userId: string;
  points: number;
  type: PointsTransactionType;
  description?: string;
  orderId?: string;
  createdAt: Date;
}
