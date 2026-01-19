export type InventoryTransactionType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastRestocked?: string;
  lastUpdated: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    status?: string;
  };
}

export interface InventoryTransaction {
  id: string;
  inventoryId: string;
  quantity: number;
  type: InventoryTransactionType;
  reason?: string;
  orderId?: string;
  quantityBefore: number;
  quantityAfter: number;
  createdAt: string;
  order?: {
    id: string;
    totalAmount: number;
    createdAt: string;
  };
}

export interface InventoryStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalItems: number;
}

export interface LowStockAlert extends Inventory {
  isLowStock: boolean;
  stockLevel: number; // Percentage
}
