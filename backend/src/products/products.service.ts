import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AdminProductsQueryDto } from './dto/admin-products-query.dto';
import { OrderStatus } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async addProductImages(
    productId: string,
    files: Array<Express.Multer.File>,
    opts?: { setPrimaryFirst?: boolean; replaceAll?: boolean },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Optional: replace all images
    if (opts?.replaceAll) {
      // delete files on cloudinary (if we had public_id)
      // For now, assume user manages deletions manually or we ignore stale images in cloud for simplicity
      // Or we can try to extract public_id from url.
      for (const img of product.images) {
        // Simple heuristic to get public_id
        // .../upload/v12345/smart-restaurant/products/xyz.jpg -> smart-restaurant/products/xyz
        // This is tricky without exact public_id storage.
        // We will skip deleting from cloud for now to avoid errors.
      }
      await this.prisma.productImage.deleteMany({ where: { productId } });
    }

    const uploadedImages: any[] = [];
    for (const file of files) {
      const result = await this.cloudinary.uploadImage(file).catch(() => null);
      if (result) {
        uploadedImages.push(result);
      }
    }

    const existing = await this.prisma.productImage.findMany({
      where: { productId },
    });
    const hasPrimary = existing.some((i) => i.isPrimary);

    const imagesData = uploadedImages.map((img, idx) => ({
      url: img.secure_url,
      isPrimary:
        (!hasPrimary && idx === 0) || (!!opts?.setPrimaryFirst && idx === 0),
      productId,
    }));

    // Nếu setPrimaryFirst=true: set tất cả ảnh cũ thành non-primary
    if (opts?.setPrimaryFirst) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    await this.prisma.productImage.createMany({ data: imagesData });

    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
  }

  async setPrimaryProductImage(productId: string, imageId: string) {
    const img = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!img) throw new NotFoundException('Image not found');

    await this.prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });

    await this.prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
  }

  async deleteProductImage(productId: string, imageId: string) {
    const img = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });
    if (!img) throw new NotFoundException('Image not found');

    // delete DB
    await this.prisma.productImage.delete({ where: { id: imageId } });

    // delete file on Cloudinary (optional/best effort if we can parse ID)
    // this.cloudinary.deleteImage(...)

    // if deleted primary -> set newest as primary (optional)
    const remaining = await this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    if (remaining.length > 0 && remaining.every((x) => !x.isPrimary)) {
      await this.prisma.productImage.update({
        where: { id: remaining[0].id },
        data: { isPrimary: true },
      });
    }

    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });
  }



  async create(createProductDto: CreateProductDto) {
    const { name, description, price, status, categoryName, imageUrl, allergens, isChefRecommended, prepTimeMinutes } =
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
        allergens: allergens ?? null,
        price: new Prisma.Decimal(price),
        status: (status ?? 'AVAILABLE') as any,
        categoryId: category.id,
        isChefRecommended: isChefRecommended ?? false,
        prepTimeMinutes: prepTimeMinutes ?? null,
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
        reviews: true,
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
          images: true,
          category: true,
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
        category: true,
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
        reviews: true,
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

    const { name, description, price, status, categoryName, imageUrl, allergens, isChefRecommended, prepTimeMinutes } =
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
        allergens: allergens === undefined ? undefined : allergens,
        price:
          price === undefined ? undefined : new Prisma.Decimal(String(price)),
        status: status ?? undefined,
        categoryId: categoryId ?? undefined,
        isChefRecommended: isChefRecommended ?? undefined,
        prepTimeMinutes: prepTimeMinutes === undefined ? undefined : prepTimeMinutes,
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
