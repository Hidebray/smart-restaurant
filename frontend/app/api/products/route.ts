import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Lấy query param từ URL (ví dụ: ?category=food)
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    // Tạo bộ lọc (nếu có categoryId thì lọc, không thì lấy hết)
    const whereCondition = categoryId ? { categoryId } : {};

    const products = await prisma.product.findMany({
      where: {
        ...whereCondition,
        status: 'AVAILABLE' // Chỉ lấy món đang bán
      },
      include: {
        category: true, // Lấy kèm thông tin danh mục
        images: true,   // Lấy kèm ảnh
        modifierGroups: { // Lấy kèm các tùy chọn (Topping, Size)
          include: {
            modifierGroup: {
              include: {
                options: true
              }
            }
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}