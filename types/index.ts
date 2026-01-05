
export enum UserRole {
  ADMIN = 'ADMIN',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  INACTIVE = 'INACTIVE',
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED', // Same as SERVED for now
  CANCELLED = 'CANCELLED', // Same as REJECTED for now
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
}

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  categoryId: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
