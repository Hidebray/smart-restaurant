import { ModifierOption } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ModifierOptionEntity implements ModifierOption {
  id: string;
  name: string;
  priceAdjustment: Decimal;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}
