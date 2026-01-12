// prisma/seed.ts

import { PrismaClient, UserRole, TableStatus, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Xóa dữ liệu cũ (để tránh trùng lặp khi chạy lại)
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

  // 2. Tạo Users
  console.log('Creating users...')
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@smart.restaurant',
        password: '123', // Thực tế phải hash
        name: 'Chủ Quán (Admin)',
        role: UserRole.ADMIN,
      },
      {
        email: 'waiter@smart.restaurant',
        password: '123',
        name: 'Nguyễn Văn A (Phục vụ)',
        role: UserRole.WAITER,
      },
      {
        email: 'kitchen@smart.restaurant',
        password: '123',
        name: 'Trần Văn B (Bếp)',
        role: UserRole.KITCHEN,
      },
    ],
  })

  // 3. Tạo Bàn
  console.log('Creating tables...')
  const tablesData = Array.from({ length: 10 }).map((_, i) => ({
    tableNumber: `T-${i + 1}`,
    capacity: 4,
    status: TableStatus.AVAILABLE,
    qrToken: `token-table-${i + 1}`, // Giả lập token
  }))
  await prisma.table.createMany({ data: tablesData })

  // 4. Tạo Danh mục (Categories)
  console.log('Creating categories...')
  const catFood = await prisma.category.create({ data: { name: 'Món Chính', displayOrder: 1 } })
  const catDrink = await prisma.category.create({ data: { name: 'Đồ Uống', displayOrder: 2 } })

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
        ],
      },
    },
  })

  // 6. Tạo Sản phẩm (Products)
  console.log('Creating products...')
  
  // Phở Bò
  await prisma.product.create({
    data: {
      name: 'Phở Bò Đặc Biệt',
      description: 'Nạm, Gầu, Gân, Bò viên',
      price: 65000,
      categoryId: catFood.id,
      status: ProductStatus.AVAILABLE,
      isChefRecommended: true,
      images: {
        create: { url: 'https://images.unsplash.com/photo-1582878826618-c053af6ec47d?auto=format&fit=crop&w=800', isPrimary: true }
      }
    }
  })

  // Cơm Rang
  await prisma.product.create({
    data: {
      name: 'Cơm Rang Dưa Bò',
      description: 'Cơm rang vàng giòn với dưa chua và thịt bò thăn',
      price: 55000,
      categoryId: catFood.id,
      images: {
        create: { url: 'https://images.unsplash.com/photo-1603133872878-684f1084261d?auto=format&fit=crop&w=800', isPrimary: true }
      }
    }
  })

  // Trà Sữa (Có gắn Modifier Size và Topping)
  await prisma.product.create({
    data: {
      name: 'Trà Sữa Truyền Thống',
      description: 'Hồng trà sữa đậm đà',
      price: 30000,
      categoryId: catDrink.id,
      images: {
        create: { url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800', isPrimary: true }
      },
      // Gắn modifier vào món này
      modifierGroups: {
        create: [
          { modifierGroupId: sizeGroup.id, displayOrder: 1 },
          { modifierGroupId: toppingGroup.id, displayOrder: 2 },
        ]
      }
    }
  })

  console.log('✅ Seed data successfully!')
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