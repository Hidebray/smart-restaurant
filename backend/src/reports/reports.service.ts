import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) { }

  async getSummary(from?: string, to?: string) {
    const whereClause: any = { status: OrderStatus.COMPLETED };

    if (from || to) {
      whereClause.createdAt = {};
      if (from) whereClause.createdAt.gte = new Date(from);
      if (to) whereClause.createdAt.lte = new Date(to);
    }

    const aggregates = await this.prisma.order.aggregate({
      where: whereClause,
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const firstOrder = await this.prisma.order.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: 'asc'
      }
    });

    const lastOrder = await this.prisma.order.findFirst({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      totalRevenue: aggregates._sum.totalAmount ?? 0,
      totalOrders: aggregates._count.id ?? 0,
      firstOrderDate: firstOrder?.createdAt ?? null,
      lastOrderDate: lastOrder?.createdAt ?? null,
    };
  }
  async getTopProducts(take = 5) {
    const topProductItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: OrderStatus.COMPLETED,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take,
    });

    const productIds = topProductItems.map(p => p.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include: {
        images: {
          where: { isPrimary: true }
        }
      }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    return topProductItems.map(item => {
      const product = productMap.get(item.productId);
      return {
        ...product,
        totalSold: item._sum.quantity,
      }
    })
  }
}
