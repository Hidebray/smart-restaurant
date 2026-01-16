import { ModifierGroup } from '@prisma/client';

export class ModifierGroupEntity implements ModifierGroup {
  id: string;
  name: string;
  selectionType: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  createdAt: Date;
  updatedAt: Date;
}
