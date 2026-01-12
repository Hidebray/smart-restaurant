// types/index.ts

export type ProductStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'SOLD_OUT';

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
  price: number;
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
  modifierGroups: ProductModifierGroup[]; // Quan trọng: Topping/Size
}

export interface CartItem {
  productId: string;
  quantity: number;
  modifiers: {
    modifierOptionId: string;
    name: string;
    price: number;
  }[];
}