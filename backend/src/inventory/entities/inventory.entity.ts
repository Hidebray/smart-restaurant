export class InventoryEntity {
  id: string;
  productId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastRestocked?: Date;
  lastUpdated: Date;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
  };
}
