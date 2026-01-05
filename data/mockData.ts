
import { Table, Category, Product, TableStatus, ProductStatus } from '../types';

export const tables: Table[] = [
  { id: 't1', tableNumber: '1', capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't2', tableNumber: '2', capacity: 2, status: TableStatus.OCCUPIED },
  { id: 't3', tableNumber: '3', capacity: 6, status: TableStatus.AVAILABLE },
  { id: 't4', tableNumber: '4', capacity: 4, status: TableStatus.RESERVED },
  { id: 't5', tableNumber: '5', capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't6', tableNumber: '6', capacity: 8, status: TableStatus.OCCUPIED },
  { id: 't7', tableNumber: '7', capacity: 4, status: TableStatus.INACTIVE },
  { id: 't8', tableNumber: '8', capacity: 4, status: TableStatus.AVAILABLE },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Khai vị', displayOrder: 1 },
  { id: 'cat2', name: 'Món chính', displayOrder: 2 },
  { id: 'cat3', name: 'Tráng miệng', displayOrder: 3 },
  { id: 'cat4', name: 'Đồ uống', displayOrder: 4 },
];

export const products: Product[] = [
  // Khai vị
  {
    id: 'p1',
    name: 'Gỏi cuốn tôm thịt',
    description: 'Bánh tráng cuốn với bún, tôm, thịt, rau sống, chấm cùng nước mắm chua ngọt.',
    price: 65000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat1',
    imageUrl: 'https://picsum.photos/seed/goicuon/400/300',
  },
  {
    id: 'p2',
    name: 'Chả giò hải sản',
    description: 'Chả giò giòn rụm với nhân hải sản tươi ngon.',
    price: 80000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat1',
    imageUrl: 'https://picsum.photos/seed/chagio/400/300',
  },
  // Món chính
  {
    id: 'p3',
    name: 'Phở bò tái lăn',
    description: 'Phở bò truyền thống với thịt bò được xào tái trên lửa lớn, thơm nức.',
    price: 75000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat2',
    imageUrl: 'https://picsum.photos/seed/phobo/400/300',
  },
  {
    id: 'p4',
    name: 'Bún chả Hà Nội',
    description: 'Bún, chả nướng than hoa, ăn kèm rau sống và nước mắm chua ngọt đặc trưng.',
    price: 60000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat2',
    imageUrl: 'https://picsum.photos/seed/buncha/400/300',
  },
  {
    id: 'p5',
    name: 'Cơm tấm sườn bì chả',
    description: 'Cơm tấm nóng hổi với sườn nướng, bì, chả trứng và đồ chua.',
    price: 70000,
    status: ProductStatus.SOLD_OUT,
    categoryId: 'cat2',
    imageUrl: 'https://picsum.photos/seed/comtam/400/300',
  },
   {
    id: 'p6',
    name: 'Bò lúc lắc',
    description: 'Thịt bò thái hạt lựu xào với ớt chuông, hành tây, dùng kèm khoai tây chiên.',
    price: 150000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat2',
    imageUrl: 'https://picsum.photos/seed/boluclac/400/300',
  },
  // Tráng miệng
  {
    id: 'p7',
    name: 'Chè khúc bạch',
    description: 'Chè thanh mát với khúc bạch phô mai, hạnh nhân và nhãn.',
    price: 45000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat3',
    imageUrl: 'https://picsum.photos/seed/chekhucbach/400/300',
  },
  {
    id: 'p8',
    name: 'Bánh flan caramen',
    description: 'Bánh flan mềm mịn, béo ngậy với lớp caramen óng ả.',
    price: 35000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat3',
    imageUrl: 'https://picsum.photos/seed/flan/400/300',
  },
  // Đồ uống
  {
    id: 'p9',
    name: 'Nước chanh tươi',
    description: 'Giải nhiệt tức thì với nước chanh tươi mát lạnh.',
    price: 30000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat4',
    imageUrl: 'https://picsum.photos/seed/chanh/400/300',
  },
  {
    id: 'p10',
    name: 'Cà phê sữa đá',
    description: 'Cà phê đậm đà hòa quyện cùng sữa đặc ngọt ngào.',
    price: 35000,
    status: ProductStatus.AVAILABLE,
    categoryId: 'cat4',
    imageUrl: 'https://picsum.photos/seed/caphe/400/300',
  },
];
