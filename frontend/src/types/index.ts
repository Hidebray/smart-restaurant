export type UserRole = 'ADMIN' | 'WAITER' | 'KITCHEN' | 'CUSTOMER';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE';

export type ProductStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'SOLD_OUT';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export type DiscountType = 'PERCENT' | 'FIXED';


export interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  options: ModifierOption[];
}

export interface ProductModifierGroup {
  modifierGroupId: string;
  displayOrder: number;
  modifierGroup: ModifierGroup;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  allergens?: string | null;
  price: string;
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  modifierGroups: ProductModifierGroup[]; // Important: Topping/Size
  isChefRecommended?: boolean;
  prepTimeMinutes?: number | null;
  orderCount?: number;
  reviews?: Review[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: Number;
  image?: string;
  quantity: number;
  modifiers: {
    modifierOptionId: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

export interface OrderModifier {
  id: string;
  modifierOption: ModifierOption;
  priceAtOrder: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers: OrderModifier[];
}

export interface Order {
  id: string;
  tableId: string;
  totalAmount: number;
  status: OrderStatus;
  discountType?: DiscountType | null;
  discountValue?: number;
  items: OrderItem[];
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    avatar: string | null;
  };
  createdAt: string;
}