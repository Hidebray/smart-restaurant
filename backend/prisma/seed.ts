// prisma/seed.ts

import { PrismaClient, UserRole, TableStatus, ProductStatus, OrderStatus, LoyaltyTier } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Xóa dữ liệu cũ (để tránh trùng lặp khi chạy lại)
  await prisma.pointsTransaction.deleteMany()
  await prisma.loyaltyPoints.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.review.deleteMany()
  await prisma.inventoryTransaction.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.orderItemModifier.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productModifierGroup.deleteMany()
  await prisma.modifierOption.deleteMany()
  await prisma.modifierGroup.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()

  // 2. Tạo Users (Hash password)
  console.log('Creating users...')
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password@123', saltRounds);

  // Staff accounts
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smart.restaurant',
      password: hashedPassword,
      name: 'Chủ Quán (Admin)',
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  })

  const waiter = await prisma.user.create({
    data: {
      email: 'waiter@smart.restaurant',
      password: hashedPassword,
      name: 'Nguyễn Văn A (Phục vụ)',
      role: UserRole.WAITER,
      isActive: true,
      isEmailVerified: true,
    },
  })

  const waiter2 = await prisma.user.create({
    data: {
      email: 'waiter2@smart.restaurant',
      password: hashedPassword,
      name: 'Lê Thị B (Phục vụ)',
      role: UserRole.WAITER,
      isActive: true,
      isEmailVerified: true,
    },
  })

  const kitchen = await prisma.user.create({
    data: {
      email: 'kitchen@smart.restaurant',
      password: hashedPassword,
      name: 'Trần Văn C (Bếp)',
      role: UserRole.KITCHEN,
      isActive: true,
      isEmailVerified: true,
    },
  })

  // Customer accounts (10 customers)
  console.log('Creating customer accounts...')
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@gmail.com',
        password: hashedPassword,
        name: 'Nguyễn Minh Tuấn',
        phone: '0901234567',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer2@gmail.com',
        password: hashedPassword,
        name: 'Trần Thị Hương',
        phone: '0912345678',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer3@gmail.com',
        password: hashedPassword,
        name: 'Lê Văn Đức',
        phone: '0923456789',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer4@gmail.com',
        password: hashedPassword,
        name: 'Phạm Thị Mai',
        phone: '0934567890',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer5@gmail.com',
        password: hashedPassword,
        name: 'Hoàng Văn Nam',
        phone: '0945678901',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer6@gmail.com',
        password: hashedPassword,
        name: 'Vũ Thị Lan',
        phone: '0956789012',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer7@gmail.com',
        password: hashedPassword,
        name: 'Đặng Minh Quân',
        phone: '0967890123',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer8@gmail.com',
        password: hashedPassword,
        name: 'Bùi Thị Ngọc',
        phone: '0978901234',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer9@gmail.com',
        password: hashedPassword,
        name: 'Ngô Văn Hải',
        phone: '0989012345',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer10@gmail.com',
        password: hashedPassword,
        name: 'Đinh Thị Phương',
        phone: '0990123456',
        role: UserRole.CUSTOMER,
        isActive: true,
        isEmailVerified: true,
      },
    }),
  ])

  // 3. Tạo Bàn (gán waiter cho một số bàn)
  console.log('Creating tables...')
  const tables = await Promise.all([
    prisma.table.create({ data: { tableNumber: 'T-1', capacity: 2, status: TableStatus.AVAILABLE, qrToken: 'token-table-1', location: 'Tầng 1 - Cửa sổ', assignedWaiterId: waiter.id } }),
    prisma.table.create({ data: { tableNumber: 'T-2', capacity: 4, status: TableStatus.AVAILABLE, qrToken: 'token-table-2', location: 'Tầng 1 - Cửa sổ', assignedWaiterId: waiter.id } }),
    prisma.table.create({ data: { tableNumber: 'T-3', capacity: 4, status: TableStatus.AVAILABLE, qrToken: 'token-table-3', location: 'Tầng 1 - Giữa', assignedWaiterId: waiter.id } }),
    prisma.table.create({ data: { tableNumber: 'T-4', capacity: 6, status: TableStatus.AVAILABLE, qrToken: 'token-table-4', location: 'Tầng 1 - Giữa', assignedWaiterId: waiter.id } }),
    prisma.table.create({ data: { tableNumber: 'T-5', capacity: 8, status: TableStatus.AVAILABLE, qrToken: 'token-table-5', location: 'Tầng 1 - VIP', assignedWaiterId: waiter.id } }),
    prisma.table.create({ data: { tableNumber: 'T-6', capacity: 2, status: TableStatus.AVAILABLE, qrToken: 'token-table-6', location: 'Tầng 2 - Ban công', assignedWaiterId: waiter2.id } }),
    prisma.table.create({ data: { tableNumber: 'T-7', capacity: 4, status: TableStatus.AVAILABLE, qrToken: 'token-table-7', location: 'Tầng 2 - Ban công', assignedWaiterId: waiter2.id } }),
    prisma.table.create({ data: { tableNumber: 'T-8', capacity: 4, status: TableStatus.AVAILABLE, qrToken: 'token-table-8', location: 'Tầng 2 - Trong nhà', assignedWaiterId: waiter2.id } }),
    prisma.table.create({ data: { tableNumber: 'T-9', capacity: 6, status: TableStatus.AVAILABLE, qrToken: 'token-table-9', location: 'Tầng 2 - Trong nhà', assignedWaiterId: waiter2.id } }),
    prisma.table.create({ data: { tableNumber: 'T-10', capacity: 10, status: TableStatus.AVAILABLE, qrToken: 'token-table-10', location: 'Tầng 2 - VIP', assignedWaiterId: waiter2.id } }),
  ])

  // 4. Tạo Danh mục (Categories)
  console.log('Creating categories...')
  const catAppetizer = await prisma.category.create({ data: { name: 'Khai Vị', displayOrder: 1 } })
  const catFood = await prisma.category.create({ data: { name: 'Món Chính', displayOrder: 2 } })
  const catDrink = await prisma.category.create({ data: { name: 'Đồ Uống', displayOrder: 3 } })
  const catDessert = await prisma.category.create({ data: { name: 'Tráng Miệng', displayOrder: 4 } })

  // 5. Tạo Modifiers (Topping/Size)
  console.log('Creating modifiers...')
  // Group: Size đồ uống
  const sizeGroup = await prisma.modifierGroup.create({
    data: {
      name: 'Size',
      selectionType: 'SINGLE',
      isRequired: true,
      minSelections: 1,
      maxSelections: 1,
      options: {
        create: [
          { name: 'Size M', priceAdjustment: 0 },
          { name: 'Size L', priceAdjustment: 5000 },
        ],
      },
    },
  })

  // Group: Topping
  const toppingGroup = await prisma.modifierGroup.create({
    data: {
      name: 'Topping',
      selectionType: 'MULTIPLE',
      isRequired: false,
      maxSelections: 5,
      options: {
        create: [
          { name: 'Trân châu đen', priceAdjustment: 5000 },
          { name: 'Thạch dừa', priceAdjustment: 5000 },
          { name: 'Pudding trứng', priceAdjustment: 10000 },
          { name: 'Kem cheese', priceAdjustment: 15000 },
        ],
      },
    },
  })

  // Group: Mức đá (Sugar/Ice)
  const iceGroup = await prisma.modifierGroup.create({
    data: {
      name: 'Mức Đá',
      selectionType: 'SINGLE',
      isRequired: true,
      options: {
        create: [
          { name: '100% Đá', priceAdjustment: 0 },
          { name: '70% Đá', priceAdjustment: 0 },
          { name: '50% Đá', priceAdjustment: 0 },
          { name: '30% Đá', priceAdjustment: 0 },
          { name: 'Không Đá', priceAdjustment: 0 },
        ],
      },
    },
  })

  // 6. Tạo Sản phẩm (Products)
  console.log('Creating products...')

  // --- KHAI VỊ ---
  await prisma.product.create({
    data: {
      name: 'Nem Rán Hà Nội',
      description: 'Nem rán giòn rụm nhân thịt, mộc nhĩ, miến, cà rốt',
      price: 45000,
      categoryId: catAppetizer.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://icdn.one/upload/2020/11/13/20201113061759-f9295f1c.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Gỏi cuốn tôm tươi, thịt ba chỉ, bún và rau sống, chấm mắm nêm',
      price: 35000,
      categoryId: catAppetizer.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://naucohungthinh.com/files/media/202109/5519_4.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Nộm Đu Đủ Bò Khô',
      description: 'Đu đủ xanh giòn, bò khô, lạc rang, rau thơm',
      price: 40000,
      categoryId: catAppetizer.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://i.ytimg.com/vi/ueSmw3tgXBI/maxresdefault.jpg', isPrimary: true } }
    }
  })

  // --- MÓN CHÍNH ---
  await prisma.product.create({
    data: {
      name: 'Phở Bò Đặc Biệt',
      description: 'Tô đặc biệt gồm tái, nạm, gầu, gân, bò viên thượng hạng',
      price: 75000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      isChefRecommended: true,
      images: { create: { url: 'https://vietnamtravellife.vn/wp-content/uploads/2023/11/pho-bo.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Bún Chả Hà Nội',
      description: 'Chả viên và chả miếng nướng than hoa, ăn kèm bún và nem',
      price: 65000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      isChefRecommended: true,
      images: { create: { url: 'https://sunhouse.com.vn/pic/news/images/image-20211229181528-1.jpeg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Cơm Rang Dưa Bò',
      description: 'Cơm rang vàng giòn với dưa chua và thịt bò thăn xào đậm đà',
      price: 55000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://barona.vn/storage/meo-vat/45/com-rang-dua-bo-thanh-pham.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Bún Bò Huế',
      description: 'Hương vị cố đó với chân giò, tiết, chả cua',
      price: 60000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://www.hungryhuy.com/wp-content/uploads/bun-bo-hue-bowl.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Bánh Mì Thập Cẩm',
      description: 'Pate, thịt xá xíu, chả lụa, dưa góp',
      price: 30000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://2sao.vietnamnetjsc.vn/images/2020/02/28/19/32/banhmi-1.jpg', isPrimary: true } }
    }
  })

  // --- ĐỒ UỐNG ---
  await prisma.product.create({
    data: {
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê Robusta Việt Nam pha phin với sữa đặc',
      price: 35000,
      categoryId: catDrink.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://giacaphe.com/wp-content/uploads/2023/03/ca-phe-sua-da-2.jpg', isPrimary: true } },
      modifierGroups: {
        create: [{ modifierGroupId: iceGroup.id, displayOrder: 1 }]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Trà Sữa Trân Châu Đường Đen',
      description: 'Sữa tươi thanh trùng với đường đen Hàn Quốc và trân châu',
      price: 45000,
      categoryId: catDrink.id,
      status: ProductStatus.AVAILABLE,
      isChefRecommended: true,
      images: { create: { url: 'https://cdn.tgdd.vn/Files/2022/01/21/1412109/huong-dan-cach-lam-tra-sua-tran-chau-duong-den-202201211522033706.jpg', isPrimary: true } },
      modifierGroups: {
        create: [
          { modifierGroupId: sizeGroup.id, displayOrder: 1 },
          { modifierGroupId: toppingGroup.id, displayOrder: 2 },
          { modifierGroupId: iceGroup.id, displayOrder: 3 },
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Trà Đào Cam Sả',
      description: 'Trà đào mát lạnh với miếng đào giòn và hương sả thơm',
      price: 40000,
      categoryId: catDrink.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://cdn.tgdd.vn/2020/07/CookRecipe/GalleryStep/thanh-pham-273.jpg', isPrimary: true } },
      modifierGroups: {
        create: [
          { modifierGroupId: sizeGroup.id, displayOrder: 1 },
          { modifierGroupId: iceGroup.id, displayOrder: 2 },
        ]
      }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Nước Ép Dưa Hấu',
      description: 'Nước ép dưa hấu nguyên chất không đường',
      price: 40000,
      categoryId: catDrink.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://cookbeo.com/media/2020/12/nuoc-ep-dua-hau/coc-nuoc-ep-dua-hau.jpg', isPrimary: true } },
      modifierGroups: {
        create: [
          { modifierGroupId: iceGroup.id, displayOrder: 1 },
        ]
      }
    }
  })

  // --- TRÁNG MIỆNG ---
  await prisma.product.create({
    data: {
      name: 'Chè Khúc Bạch',
      description: 'Khúc bạch phô mai béo ngậy, hạnh nhân và nhãn lồng',
      price: 35000,
      categoryId: catDessert.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://bepbtn.vn/wp-content/uploads/2022/06/che-khuc-bach.jpg', isPrimary: true } }
    }
  })

  await prisma.product.create({
    data: {
      name: 'Bánh Flan',
      description: 'Bánh flan trứng sữa mềm mịn',
      price: 20000,
      categoryId: catDessert.id,
      status: ProductStatus.AVAILABLE,
      images: { create: { url: 'https://satrafoods.com.vn/uploads/Images/mon-ngon-moi-ngay/banh-flan.jpg', isPrimary: true } }
    }
  })

  // 7. Tạo Vouchers
  console.log('Creating vouchers...')
  const vouchers = await Promise.all([
    prisma.voucher.create({
      data: {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: 'Giảm 10% cho khách hàng mới',
        discountType: 'PERCENT',
        discountValue: 10,
        minOrderAmount: 100000,
        maxUses: 100,
        usedCount: 15,
        isActive: true,
        expiryDate: new Date('2026-12-31'),
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'FREESHIP50',
        name: 'Giảm 50K',
        description: 'Giảm 50,000đ cho đơn từ 200K',
        discountType: 'FIXED',
        discountValue: 50000,
        minOrderAmount: 200000,
        maxUses: 50,
        usedCount: 8,
        isActive: true,
        expiryDate: new Date('2026-06-30'),
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'VIP20',
        name: 'VIP Member',
        description: 'Giảm 20% cho thành viên VIP',
        discountType: 'PERCENT',
        discountValue: 20,
        minOrderAmount: 300000,
        maxUses: 30,
        usedCount: 5,
        isActive: true,
        expiryDate: new Date('2026-03-31'),
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'LOYALTY100',
        name: 'Loyalty Reward',
        description: 'Giảm 100K đổi từ điểm tích lũy',
        discountType: 'FIXED',
        discountValue: 100000,
        minOrderAmount: 500000,
        maxUses: 20,
        usedCount: 3,
        isActive: true,
        expiryDate: new Date('2026-12-31'),
      },
    }),
  ])

  // 8. Lấy tất cả products để tạo orders
  const allProducts = await prisma.product.findMany({ include: { images: true } })
  const productMap = new Map(allProducts.map(p => [p.name, p]))

  // 9. Tạo Orders (đơn hàng mẫu với các trạng thái khác nhau)
  console.log('Creating orders...')
  
  // Helper function để tạo order
  const createOrder = async (
    customerId: string,
    tableId: string,
    status: OrderStatus,
    items: { productName: string; quantity: number; notes?: string }[],
    daysAgo: number = 0,
    discountType?: 'PERCENT' | 'FIXED',
    discountValue?: number
  ) => {
    const orderItems = items.map(item => {
      const product = productMap.get(item.productName)!
      const unitPrice = Number(product.price)
      const totalPrice = unitPrice * item.quantity
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        notes: item.notes,
      }
    })

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - daysAgo)
    createdAt.setHours(Math.floor(Math.random() * 12) + 10) // 10:00 - 22:00

    return prisma.order.create({
      data: {
        tableId,
        customerId,
        status,
        totalAmount,
        discountType,
        discountValue,
        createdAt,
        updatedAt: createdAt,
        items: {
          create: orderItems,
        },
      },
    })
  }

  // Tạo nhiều đơn hàng đã hoàn thành (để có dữ liệu reports)
  const completedOrders: Awaited<ReturnType<typeof createOrder>>[] = []
  
  // Đơn hàng trong 30 ngày qua
  for (let i = 0; i < 30; i++) {
    const customerIndex = i % customers.length
    const tableIndex = i % tables.length
    
    // Mỗi ngày có 2-5 đơn
    const ordersPerDay = Math.floor(Math.random() * 4) + 2
    
    for (let j = 0; j < ordersPerDay; j++) {
      const items = [
        { productName: ['Phở Bò Đặc Biệt', 'Bún Chả Hà Nội', 'Cơm Rang Dưa Bò', 'Bún Bò Huế', 'Bánh Mì Thập Cẩm'][Math.floor(Math.random() * 5)], quantity: Math.floor(Math.random() * 2) + 1 },
        { productName: ['Cà Phê Sữa Đá', 'Trà Sữa Trân Châu Đường Đen', 'Trà Đào Cam Sả', 'Nước Ép Dưa Hấu'][Math.floor(Math.random() * 4)], quantity: Math.floor(Math.random() * 3) + 1 },
      ]
      
      // Thêm món khai vị ngẫu nhiên
      if (Math.random() > 0.5) {
        items.push({ productName: ['Nem Rán Hà Nội', 'Gỏi Cuốn Tôm Thịt', 'Nộm Đu Đủ Bò Khô'][Math.floor(Math.random() * 3)], quantity: 1 })
      }
      
      // Thêm tráng miệng ngẫu nhiên
      if (Math.random() > 0.7) {
        items.push({ productName: ['Chè Khúc Bạch', 'Bánh Flan'][Math.floor(Math.random() * 2)], quantity: Math.floor(Math.random() * 2) + 1 })
      }

      const order = await createOrder(
        customers[(customerIndex + j) % customers.length].id,
        tables[(tableIndex + j) % tables.length].id,
        OrderStatus.COMPLETED,
        items,
        i, // days ago
        Math.random() > 0.8 ? 'PERCENT' : undefined,
        Math.random() > 0.8 ? 10 : undefined
      )
      completedOrders.push(order)
    }
  }

  // Tạo một số đơn hàng đang xử lý (PENDING, ACCEPTED, PREPARING, READY, SERVED)
  console.log('Creating active orders...')
  
  // Đơn PENDING (chờ xác nhận)
  await createOrder(customers[0].id, tables[0].id, OrderStatus.PENDING, [
    { productName: 'Phở Bò Đặc Biệt', quantity: 2 },
    { productName: 'Trà Đào Cam Sả', quantity: 2 },
  ], 0)

  await createOrder(customers[1].id, tables[1].id, OrderStatus.PENDING, [
    { productName: 'Bún Chả Hà Nội', quantity: 1 },
    { productName: 'Nem Rán Hà Nội', quantity: 1 },
    { productName: 'Cà Phê Sữa Đá', quantity: 1 },
  ], 0)

  // Đơn ACCEPTED (đã nhận, chưa nấu)
  await createOrder(customers[2].id, tables[2].id, OrderStatus.ACCEPTED, [
    { productName: 'Cơm Rang Dưa Bò', quantity: 2 },
    { productName: 'Gỏi Cuốn Tôm Thịt', quantity: 1 },
    { productName: 'Nước Ép Dưa Hấu', quantity: 2 },
  ], 0)

  // Đơn PREPARING (đang nấu)
  await createOrder(customers[3].id, tables[3].id, OrderStatus.PREPARING, [
    { productName: 'Bún Bò Huế', quantity: 3 },
    { productName: 'Trà Sữa Trân Châu Đường Đen', quantity: 3 },
    { productName: 'Chè Khúc Bạch', quantity: 2 },
  ], 0)

  // Đơn READY (sẵn sàng bưng)
  await createOrder(customers[4].id, tables[4].id, OrderStatus.READY, [
    { productName: 'Phở Bò Đặc Biệt', quantity: 1 },
    { productName: 'Bánh Mì Thập Cẩm', quantity: 2 },
    { productName: 'Cà Phê Sữa Đá', quantity: 2 },
  ], 0)

  // Đơn SERVED (đang ăn, chờ thanh toán)
  await createOrder(customers[5].id, tables[5].id, OrderStatus.SERVED, [
    { productName: 'Bún Chả Hà Nội', quantity: 2 },
    { productName: 'Nộm Đu Đủ Bò Khô', quantity: 1 },
    { productName: 'Trà Đào Cam Sả', quantity: 2 },
    { productName: 'Bánh Flan', quantity: 2 },
  ], 0)

  await createOrder(customers[6].id, tables[6].id, OrderStatus.SERVED, [
    { productName: 'Cơm Rang Dưa Bò', quantity: 3 },
    { productName: 'Nem Rán Hà Nội', quantity: 2 },
    { productName: 'Nước Ép Dưa Hấu', quantity: 3 },
  ], 0)

  // 10. Tạo Loyalty Points cho customers
  console.log('Creating loyalty points...')
  const loyaltyData = [
    { customer: customers[0], points: 2500, tier: LoyaltyTier.SILVER, totalEarned: 3000, totalRedeemed: 500 },
    { customer: customers[1], points: 1200, tier: LoyaltyTier.BRONZE, totalEarned: 1500, totalRedeemed: 300 },
    { customer: customers[2], points: 5500, tier: LoyaltyTier.GOLD, totalEarned: 6000, totalRedeemed: 500 },
    { customer: customers[3], points: 800, tier: LoyaltyTier.BRONZE, totalEarned: 800, totalRedeemed: 0 },
    { customer: customers[4], points: 12000, tier: LoyaltyTier.PLATINUM, totalEarned: 15000, totalRedeemed: 3000 },
    { customer: customers[5], points: 3200, tier: LoyaltyTier.SILVER, totalEarned: 4000, totalRedeemed: 800 },
    { customer: customers[6], points: 450, tier: LoyaltyTier.BRONZE, totalEarned: 450, totalRedeemed: 0 },
    { customer: customers[7], points: 7800, tier: LoyaltyTier.GOLD, totalEarned: 8500, totalRedeemed: 700 },
    { customer: customers[8], points: 1800, tier: LoyaltyTier.BRONZE, totalEarned: 2000, totalRedeemed: 200 },
    { customer: customers[9], points: 4100, tier: LoyaltyTier.SILVER, totalEarned: 5000, totalRedeemed: 900 },
  ]

  for (const data of loyaltyData) {
    await prisma.loyaltyPoints.create({
      data: {
        userId: data.customer.id,
        points: data.points,
        tier: data.tier,
        totalEarned: data.totalEarned,
        totalRedeemed: data.totalRedeemed,
      },
    })
  }

  // 11. Tạo một số Points Transactions
  console.log('Creating points transactions...')
  for (let i = 0; i < Math.min(completedOrders.length, 50); i++) {
    const order = completedOrders[i]
    const pointsEarned = Math.floor(Number(order.totalAmount) / 10000)
    
    await prisma.pointsTransaction.create({
      data: {
        userId: order.customerId!,
        points: pointsEarned,
        type: 'EARN',
        description: `Tích điểm từ đơn hàng #${order.id.substring(0, 8)}`,
        orderId: order.id,
        createdAt: order.createdAt,
      },
    })
  }

  // 12. Tạo Reviews
  console.log('Creating reviews...')
  const reviewComments = [
    'Món ăn rất ngon, phục vụ tận tình!',
    'Đồ ăn tươi ngon, giá cả hợp lý.',
    'Không gian đẹp, sẽ quay lại lần sau.',
    'Phở ngon đậm đà, đúng vị Hà Nội.',
    'Bún chả nướng thơm, nem giòn rụm.',
    'Trà sữa béo ngậy, topping nhiều.',
    'Món ăn ngon nhưng hơi lâu.',
    'Chất lượng ổn định, nhân viên thân thiện.',
  ]

  for (let i = 0; i < 20; i++) {
    const product = allProducts[i % allProducts.length]
    const customer = customers[i % customers.length]
    
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: reviewComments[i % reviewComments.length],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random trong 30 ngày
      },
    })
  }

  // 13. Tạo Inventory
  console.log('Creating inventory...')
  for (const product of allProducts) {
    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 50) + 20, // 20-70
        minStock: 10,
        maxStock: 100,
        unit: product.categoryId === (await prisma.category.findFirst({ where: { name: 'Đồ Uống' } }))?.id ? 'ly' : 'phần',
      },
    })
  }

  console.log('✅ Seed data successfully!')
  console.log('📊 Summary:')
  console.log(`   - Users: ${4 + customers.length} (4 staff + ${customers.length} customers)`)
  console.log(`   - Tables: ${tables.length}`)
  console.log(`   - Products: ${allProducts.length}`)
  console.log(`   - Vouchers: ${vouchers.length}`)
  console.log(`   - Completed Orders: ${completedOrders.length}`)
  console.log(`   - Active Orders: 7`)
  console.log(`   - Loyalty Points: ${loyaltyData.length} customers`)
  console.log('')
  console.log('🔑 Demo Accounts (password: password@123):')
  console.log('   - Admin: admin@smart.restaurant')
  console.log('   - Waiter: waiter@smart.restaurant, waiter2@smart.restaurant')
  console.log('   - Kitchen: kitchen@smart.restaurant')
  console.log('   - Customers: customer1@gmail.com ... customer10@gmail.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })