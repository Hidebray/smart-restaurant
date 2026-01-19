import { InventoryTransactionType } from '@prisma/client';

export class InventoryTransactionEntity {
  id: string;
  inventoryId: string;
  quantity: number;
  type: InventoryTransactionType;
  reason?: string;
  orderId?: string;
  quantityBefore: number;
  quantityAfter: number;
  createdAt: Date;
}
