import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const aggregates = await this.prisma.order.aggregate({
      where: { status: OrderStatus.COMPLETED },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const firstOrder = await this.prisma.order.findFirst({
        orderBy: {
            createdAt: 'asc'
        }
    });
    
    const lastOrder = await this.prisma.order.findFirst({
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
