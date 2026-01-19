import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AdminProductsQueryDto } from './dto/admin-products-query.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, price, status, categoryName, imageUrl } =
      createProductDto;

    const category = await this.prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    return this.prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price: new Prisma.Decimal(price),
        status: (status ?? 'AVAILABLE') as any,
        categoryId: category.id,
        images: imageUrl
          ? {
              create: [{ url: imageUrl, isPrimary: true }],
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        modifierGroups: {
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroup: {
              include: { options: true },
            },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: true,
        modifierGroups: {
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroup: {
              include: { options: true },
            },
          },
        },
      },
    });
  }

  async findAllAdmin(q: AdminProductsQueryDto) {
    const sortBy = q.sortBy ?? 'createdAt';
    const sortDir = q.sortDir ?? 'desc';

    // ✅ Popularity: tổng quantity từ các đơn COMPLETED
    if (sortBy === 'popularity') {
      const grouped = await this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: { status: OrderStatus.COMPLETED },
        },
        _sum: { quantity: true },
      });

      const qtyMap = new Map(
        grouped.map((g) => [g.productId, g._sum.quantity ?? 0]),
      );

      const products = await this.prisma.product.findMany({
        include: {
          images: true, // giữ tương thích admin UI của bạn
        },
      });

      products.sort((a, b) => {
        const qa = qtyMap.get(a.id) ?? 0;
        const qb = qtyMap.get(b.id) ?? 0;
        return sortDir === 'asc' ? qa - qb : qb - qa;
      });

      return products;
    }

    // ✅ createdAt / name / price
    // ⚠️ Nếu schema bạn không có "price" mà là "basePrice", đổi "price" -> "basePrice"
    const orderBy =
      sortBy === 'createdAt'
        ? { createdAt: sortDir }
        : sortBy === 'name'
          ? { name: sortDir }
          : { price: sortDir };

    return this.prisma.product.findMany({
      orderBy: orderBy as any,
      include: {
        images: true,
      },
    });
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      // If no query, return all products
      return this.findAll();
    }

    // Use case-insensitive search with partial matching
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
        images: true,
        modifierGroups: {
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroup: {
              include: { options: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        modifierGroups: {
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroup: {
              include: { options: true },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const { name, description, price, status, categoryName, imageUrl } =
      updateProductDto;

    let categoryId: string | undefined;
    if (categoryName) {
      const category = await this.prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
      });
      categoryId = category.id;
    }

    // Handle primary image replacement
    const currentPrimary = existing.images.find((i) => i.isPrimary);
    const shouldReplaceImage =
      typeof imageUrl === 'string' && imageUrl.trim().length > 0;
    const shouldClearImage = imageUrl === null || imageUrl === '';

    return this.prisma.product.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description === undefined ? undefined : description,
        price:
          price === undefined ? undefined : new Prisma.Decimal(String(price)),
        status: status ?? undefined,
        categoryId: categoryId ?? undefined,
        images: shouldReplaceImage
          ? {
              deleteMany: currentPrimary
                ? { id: currentPrimary.id }
                : undefined,
              create: [{ url: imageUrl!, isPrimary: true }],
            }
          : shouldClearImage && currentPrimary
            ? { deleteMany: { id: currentPrimary.id } }
            : undefined,
      },
      include: {
        category: true,
        images: true,
        modifierGroups: {
          orderBy: { displayOrder: 'asc' },
          include: {
            modifierGroup: {
              include: { options: true },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    // Cascades will remove related product_images due to Prisma schema
    return this.prisma.product.delete({ where: { id } });
  }

  async updateProductModifierGroups(
    productId: string,
    modifierGroupIds: string[],
  ) {
    // Delete existing
    await this.prisma.productModifierGroup.deleteMany({
      where: { productId },
    });

    // Create new ones
    const createData = modifierGroupIds.map((groupId, index) => ({
      productId,
      modifierGroupId: groupId,
      displayOrder: index,
    }));

    await this.prisma.productModifierGroup.createMany({
      data: createData,
    });

    return this.findOne(productId);
  }
}
