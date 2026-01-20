import {
  PrismaClient,
  UserRole,
  TableStatus,
  ProductStatus,
  OrderStatus,
  OrderItemStatus,
  DiscountType,
  User,
  Product,
  ModifierGroup
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Professional Clean Seed...')

  // 1. CLEANUP DATABASE
  const tablenames = [
    'analytics_snapshots', 'reservations', 'inventory_transactions', 'inventory',
    'voucher_redemptions', 'vouchers', 'points_transactions', 'loyalty_points',
    'reviews', 'order_item_modifiers', 'order_items', 'orders',
    'product_modifier_groups', 'modifier_options', 'modifier_groups',
    'product_images', 'products', 'categories', 'tables', 'users'
  ];

  for (const tableName of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    } catch (error) {
      console.log(`⚠️  Could not truncate ${tableName}, trying deleteMany...`);
    }
  }

  // 2. CREATE USERS
  console.log('👤 Creating users...')
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password@123', saltRounds);

  // Admin
  await prisma.user.create({
    data: {
      email: 'admin@smart.restaurant',
      password: hashedPassword,
      name: 'Phạm Hữu Đan (Owner)',
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true
    },
  })

  // Kitchen
  await prisma.user.create({
    data: {
      email: 'kitchen@smart.restaurant',
      password: hashedPassword,
      name: 'Lâm Hoàng Vũ (Head Chef)',
      role: UserRole.KITCHEN,
      isActive: true,
      isEmailVerified: true
    },
  })

  // Staff: 3 Waiters
  const waiters = await Promise.all([
    prisma.user.create({ data: { email: 'waiter1@smart.restaurant', password: hashedPassword, name: 'Trần Đại Hiệp', role: UserRole.WAITER, isActive: true, isEmailVerified: true } }),
    prisma.user.create({ data: { email: 'waiter2@smart.restaurant', password: hashedPassword, name: 'Lê Thu Thảo', role: UserRole.WAITER, isActive: true, isEmailVerified: true } }),
    prisma.user.create({ data: { email: 'waiter3@smart.restaurant', password: hashedPassword, name: 'Nguyễn Văn Hùng', role: UserRole.WAITER, isActive: true, isEmailVerified: true } }),
  ])

  // Customers: 3 Customers
  const customers: User[] = []
  for (let i = 1; i <= 3; i++) {
    const customer = await prisma.user.create({
      data: {
        email: `customer${i}@gmail.com`,
        password: hashedPassword,
        name: `Khách Hàng ${i}`,
        phone: `090${Math.floor(Math.random() * 10000000 + 1000000)}`,
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
        avatar: null
      }
    })
    customers.push(customer)
  }

  // 3. CREATE TABLES
  console.log('🪑 Creating tables...')
  const tableData = [
    ...Array.from({ length: 10 }, (_, i) => ({ tableNumber: `T1-${i + 1}`, capacity: 4, location: 'Tầng 1 - Sảnh Chính', assignedWaiterId: waiters[0].id })),
    ...Array.from({ length: 10 }, (_, i) => ({ tableNumber: `T2-${i + 1}`, capacity: 6, location: 'Tầng 2 - Máy Lạnh', assignedWaiterId: waiters[1].id })),
  ]

  const tables = await Promise.all(tableData.map(t => prisma.table.create({
    data: { ...t, status: TableStatus.AVAILABLE, qrToken: `qr-${t.tableNumber}` }
  })))

  // 4. CREATE CATEGORIES
  console.log('📂 Creating categories...')
  const categoryNames = [
    'Khai Vị', 'Món Chính', 'Hải Sản', 'Lẩu', 'Nướng',
    'Cơm & Mì', 'Rau & Salad', 'Đồ Uống', 'Tráng Miệng', 'Rượu Vang'
  ]

  const categories = await Promise.all(categoryNames.map((name, idx) =>
    prisma.category.create({ data: { name, displayOrder: idx + 1 } })
  ))
  const catMap = new Map(categories.map(c => [c.name, c]));

  // 5. CREATE MODIFIERS
  console.log('✨ Creating modifiers...')
  const modifiersList = [
    { name: 'Size', options: ['Size M (Vừa)', 'Size L (Lớn)'] },
    { name: 'Đường', options: ['100% Đường', '70% Đường', '50% Đường', '30% Đường', 'Không Đường'] },
    { name: 'Đá', options: ['100% Đá', '70% Đá', '50% Đá', '30% Đá', 'Không Đá'] },
    { name: 'Độ Cay', options: ['Không cay', 'Cay vừa', 'Cay nhiều', 'Siêu cay'] },
    { name: 'Độ Chín (Steak)', options: ['Rare (Tái)', 'Medium Rare', 'Medium', 'Well Done'] },
    { name: 'Sốt Ăn Kèm', options: ['Sốt Tiêu Đen', 'Sốt Nấm', 'Sốt Phô Mai', 'Sốt BBQ'] },
    { name: 'Topping Trà Sữa', options: ['Trân Châu Đen', 'Thạch Trái Cây', 'Pudding Trứng', 'Kem Cheese'] },
    { name: 'Loại Mì', options: ['Mì Trứng', 'Mì Gạo', 'Hủ Tiếu Dai'] },
    { name: 'Trái Cây Thêm', options: ['Thêm Dâu', 'Thêm Xoài', 'Thêm Dưa Hấu'] },
    { name: 'Bánh Mì Thêm', options: ['Thêm 1 Ổ', 'Thêm 2 Ổ'] }
  ]

  const modifierGroups: ModifierGroup[] = []

  for (const mod of modifiersList) {
    const group = await prisma.modifierGroup.create({
      data: {
        name: mod.name,
        selectionType: 'SINGLE',
        isRequired: false,
        options: {
          create: mod.options.map(opt => ({
            name: opt,
            priceAdjustment: opt.includes('Lớn') || opt.includes('L') ? 5000 : 0
          }))
        }
      }
    })
    modifierGroups.push(group)
  }

  const sizeGroupId = modifierGroups.find(g => g.name === 'Size')?.id;
  const findModId = (namePart: string) => modifierGroups.find(g => g.name.includes(namePart))?.id;

  // 6. CREATE PRODUCTS
  console.log('🍔 Creating 50 products...')

  interface ProductSeedData {
    name: string;
    price: number;
    cat: string;
    mod: string | null;
    img: string;
  }

  const productsData: ProductSeedData[] = [
    // Khai Vị
    {
      name: 'Gỏi Cuốn Tôm Thịt',
      price: 35000,
      cat: 'Khai Vị',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Chả Giò Rế Hải Sản',
      price: 45000,
      cat: 'Khai Vị',
      mod: null,
      img: 'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?q=80&w=1740&auto=format&fit=crop' 
    },
    {
      name: 'Nộm Ngó Sen Tôm Thịt',
      price: 55000,
      cat: 'Khai Vị',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Salad Cá Ngừ',
      price: 65000,
      cat: 'Khai Vị',
      mod: null,
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Khoai Tây Chiên Bơ Tỏi',
      price: 35000,
      cat: 'Khai Vị',
      mod: null,
      img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Cánh Gà Chiên Nước Mắm',
      price: 55000,
      cat: 'Khai Vị',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop'
    },

    // Món Chính
    {
      name: 'Phở Bò Tái Nạm',
      price: 75000,
      cat: 'Món Chính',
      mod: null,
      img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Bún Chả Hà Nội Đặc Biệt',
      price: 65000,
      cat: 'Món Chính',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1585325701165-351af916e581?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Cơm Tấm Sườn Bì Chả',
      price: 55000,
      cat: 'Món Chính',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1715692728122-50b4494e0a0f?q=80&w=1740&auto=format&fit=crop'
    },
    {
      name: 'Bò Lúc Lắc Khoai Tây',
      price: 120000,
      cat: 'Món Chính',
      mod: 'Độ Chín',
      img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Gà Nướng Mật Ong Nguyên Con',
      price: 250000,
      cat: 'Món Chính',
      mod: null,
      img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Vịt Quay Bắc Kinh',
      price: 350000,
      cat: 'Món Chính',
      mod: null,
      img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=800&auto=format&fit=crop'
    },

    // Hải Sản
    {
      name: 'Tôm Hùm Alaska Nướng Phô Mai',
      price: 950000,
      cat: 'Hải Sản',
      mod: null,
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Cua Cà Mau Rang Me',
      price: 450000,
      cat: 'Hải Sản',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Mực Hấp Hành Gừng',
      price: 150000,
      cat: 'Hải Sản',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Hàu Nướng Mỡ Hành (6 con)',
      price: 120000,
      cat: 'Hải Sản',
      mod: null,
      img: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?q=80&w=800&auto=format&fit=crop' 
    },
    {
      name: 'Sò Điệp Nướng Trứng Cút',
      price: 90000,
      cat: 'Hải Sản',
      mod: null,
      img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Cá Mú Hấp Xì Dầu',
      price: 350000,
      cat: 'Hải Sản',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?q=80&w=800&auto=format&fit=crop'
    },

    // Lẩu
    {
      name: 'Lẩu Thái Tomyum Hải Sản',
      price: 499000,
      cat: 'Lẩu',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop' 
    },
    {
      name: 'Lẩu Nấm Chim Câu',
      price: 399000,
      cat: 'Lẩu',
      mod: null,
      img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf1?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Lẩu Riêu Cua Bắp Bò',
      price: 450000,
      cat: 'Lẩu',
      mod: null,
      img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Lẩu Cá Kèo Lá Giang',
      price: 350000,
      cat: 'Lẩu',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=800&auto=format&fit=crop' 
    },

    // Nướng
    {
      name: 'Sườn Nướng BBQ Tảng',
      price: 250000,
      cat: 'Nướng',
      mod: 'Sốt',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=60' 
    },
    {
      name: 'Bò Wagyu Nướng Đá',
      price: 850000,
      cat: 'Nướng',
      mod: 'Độ Chín',
      img: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Ba Chỉ Heo Nướng Mè',
      price: 120000,
      cat: 'Nướng',
      mod: null,
      img: 'https://images.unsplash.com/photo-1704007573697-6a516da421ec?q=80&w=1740&auto=format&fit=crop'
    },
    {
      name: 'Dẻ Sườn Bò Mỹ Nướng',
      price: 180000,
      cat: 'Nướng',
      mod: 'Độ Chín',
      img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop'
    },

    // Cơm & Mì
    {
      name: 'Cơm Chiên Dương Châu',
      price: 65000,
      cat: 'Cơm & Mì',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Mì Ý Sốt Bò Bằm',
      price: 75000,
      cat: 'Cơm & Mì',
      mod: null,
      img: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Mì Xào Giòn Hải Sản',
      price: 85000,
      cat: 'Cơm & Mì',
      mod: null,
      img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Cơm Niêu Cá Kho Tộ',
      price: 95000,
      cat: 'Cơm & Mì',
      mod: 'Độ Cay',
      img: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?q=80&w=800&auto=format&fit=crop'
    },

    // Rau & Salad
    {
      name: 'Salad Rong Nho Sốt Mè Rang',
      price: 55000,
      cat: 'Rau & Salad',
      mod: null,
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Rau Muống Xào Tỏi',
      price: 40000,
      cat: 'Rau & Salad',
      mod: null,
      img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Ngọn Su Su Xào Bò',
      price: 65000,
      cat: 'Rau & Salad',
      mod: null,
      img: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&auto=format&fit=crop'
    },

    // Đồ Uống
    {
      name: 'Cà Phê Sữa Đá Sài Gòn',
      price: 35000,
      cat: 'Đồ Uống',
      mod: 'Đường',
      img: 'https://plus.unsplash.com/premium_photo-1673459683929-3f3574de7e75?w=700&auto=format&fit=crop&q=60'
    },
    {
      name: 'Trà Sữa Trân Châu Đường Đen',
      price: 45000,
      cat: 'Đồ Uống',
      mod: 'Topping',
      img: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Trà Đào Cam Sả',
      price: 40000,
      cat: 'Đồ Uống',
      mod: 'Đá',
      img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Nước Ép Dưa Hấu',
      price: 40000,
      cat: 'Đồ Uống',
      mod: 'Đá',
      img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Sinh Tố Bơ',
      price: 50000,
      cat: 'Đồ Uống',
      mod: 'Đường',
      img: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Mojito Chanh Bạc Hà',
      price: 55000,
      cat: 'Đồ Uống',
      mod: 'Đá',
      img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop'
    },

    // Tráng Miệng
    {
      name: 'Bánh Flan Caramel',
      price: 20000,
      cat: 'Tráng Miệng',
      mod: null,
      img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Chè Khúc Bạch Hạnh Nhân',
      price: 35000,
      cat: 'Tráng Miệng',
      mod: null,
      img: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Bánh Tiramisu Ý',
      price: 45000,
      cat: 'Tráng Miệng',
      mod: null,
      img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Panna Cotta Dâu Tây',
      price: 35000,
      cat: 'Tráng Miệng',
      mod: null,
      img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop' 
    },

    // Rượu Vang
    {
      name: 'Rượu Vang Đỏ Cabernet Sauvignon',
      price: 850000,
      cat: 'Rượu Vang',
      mod: null,
      img: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Rượu Vang Trắng Chardonnay',
      price: 950000,
      cat: 'Rượu Vang',
      mod: null,
      img: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Bia Tiger Crystal (Thùng)',
      price: 450000,
      cat: 'Rượu Vang',
      mod: null,
      img: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Bia Heineken (Thùng)',
      price: 480000,
      cat: 'Rượu Vang',
      mod: null,
      img: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Soju Hàn Quốc',
      price: 65000,
      cat: 'Rượu Vang',
      mod: null,
      img: 'https://images.unsplash.com/photo-1528615141309-53f2564d3be8?w=700&auto=format&fit=crop&q=60'
    }
  ];
  const allProducts: Product[] = [];

  for (const p of productsData) {
    const categoryId = catMap.get(p.cat)?.id || categories[0].id;
    const contextModId = p.mod ? findModId(p.mod) : null;

    // Fix lỗi never[] khi push vào mảng
    const modsToCreate: { modifierGroupId: string; displayOrder: number }[] = [];

    if (sizeGroupId) {
      modsToCreate.push({ modifierGroupId: sizeGroupId, displayOrder: 0 });
    }
    if (contextModId && contextModId !== sizeGroupId) {
      modsToCreate.push({ modifierGroupId: contextModId, displayOrder: 1 });
    }

    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: `Hương vị đặc trưng của món ${p.name}, được chế biến từ nguyên liệu tươi ngon nhất.`,
        price: p.price,
        categoryId: categoryId,
        status: ProductStatus.AVAILABLE,
        isChefRecommended: Math.random() < 0.2,

        // ProductImage Relation
        images: p.img ? { create: { url: p.img, isPrimary: true } } : undefined,

        // Modifier Relation
        modifierGroups: {
          create: modsToCreate
        }
      }
    });
    allProducts.push(product);
  }

  // 7. CREATE VOUCHERS
  console.log('🎟️ Creating vouchers...')
  const vouchersData = [
    { code: 'WELCOME10', name: 'Giảm 10%', val: 10, type: DiscountType.PERCENT },
    { code: 'GIAM50K', name: 'Giảm 50K', val: 50000, type: DiscountType.FIXED },
    { code: 'VIP20', name: 'VIP 20%', val: 20, type: DiscountType.PERCENT },
    { code: 'FREESHIP', name: 'Freeship', val: 15000, type: DiscountType.FIXED },
    { code: 'TET2026', name: 'Lì Xì Tết', val: 100000, type: DiscountType.FIXED }
  ]
  await Promise.all(vouchersData.map(v => prisma.voucher.create({
    data: {
      code: v.code, name: v.name, description: v.name,
      discountType: v.type, discountValue: v.val, minOrderAmount: 0,
      maxUses: 100, isActive: true, expiryDate: new Date('2026-12-31')
    }
  })))

  // 8. CREATE INVENTORY
  console.log('📦 Creating inventory...')
  for (const product of allProducts) {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 100,
        minStock: 10, maxStock: 200, unit: 'phần'
      }
    })
  }

  // 9. CREATE ORDERS & REVIEWS
  console.log('🍳 Creating random orders & reviews...')

  const reviewComments = [
    "Món này rất ngon, nêm nếm vừa miệng.",
    "Tuyệt vời, thịt mềm và thơm.",
    "Không gian quán đẹp, đồ ăn trình bày bắt mắt.",
    "Hơi mặn so với khẩu vị của mình một chút.",
    "Phục vụ nhiệt tình, món ăn ra nhanh.",
    "Giá cả hợp lý, chất lượng ổn.",
    "Món này ăn lạ miệng, rất thích nước sốt.",
    "Bình thường, không quá đặc sắc.",
    "Rất recommend mọi người thử món này nhé!",
    "Đồ ăn nóng hổi, rau tươi."
  ];

  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    const table = tables[i % tables.length];

    // 1. Shuffle & Select Products
    const shuffledProducts = [...allProducts].sort(() => 0.5 - Math.random());
    const numberOfItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
    const selectedProducts = shuffledProducts.slice(0, numberOfItems);

    // 2. Prepare Order Items
    const orderItemsData = selectedProducts.map(prod => {
      const qty = Math.floor(Math.random() * 2) + 1;
      return {
        productId: prod.id,
        quantity: qty,
        unitPrice: Number(prod.price),
        totalPrice: Number(prod.price) * qty,
        status: OrderItemStatus.SERVED
      };
    });

    const totalOrderAmount = orderItemsData.reduce((sum, item) => sum + item.totalPrice, 0);

    // 3. Create Order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        tableId: table.id,
        status: OrderStatus.COMPLETED,
        totalAmount: totalOrderAmount,
        guestCount: Math.floor(Math.random() * 4) + 1,
        createdAt: new Date(),
        items: { create: orderItemsData }
      }
    });

    // 4. Create Reviews
    for (let j = 0; j < selectedProducts.length; j++) {
      if (j < 2 || Math.random() > 0.5) {
        const product = selectedProducts[j];
        await prisma.review.create({
          data: {
            userId: customer.id,
            productId: product.id,
            rating: Math.floor(Math.random() * 3) + 3,
            comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
          }
        });
      }
    }
  }

  console.log('✅ Professional Seed Completed!');
  console.log(`   - Users: 3 Staff + 3 Customers`);
  console.log(`   - Tables: ${tables.length}`);
  console.log(`   - Products: ${allProducts.length} (Ready for images)`);
  console.log(`   - All Products have SIZE modifier!`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Orders: 20 (Randomized)`);
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })