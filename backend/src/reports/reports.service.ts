import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type GroupBy = 'day' | 'week' | 'month';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) { }

  // ----------------------------
  // Existing summary (giữ nguyên)
  // ----------------------------
  async getSummary(from?: string, to?: string) {
    const whereClause: any = { status: OrderStatus.COMPLETED };

    if (from || to) {
      whereClause.createdAt = {};
      if (from) whereClause.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        whereClause.createdAt.lte = toDate;
      }
    }

    // Use findMany to calculate correct revenue with discounts
    const orders = await this.prisma.order.findMany({
      where: whereClause,
      select: {
        totalAmount: true,
        discountType: true,
        discountValue: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    let totalRevenue = 0;
    for (const order of orders) {
      let amount = Number(order.totalAmount ?? 0);
      const dValue = Number(order.discountValue ?? 0);
      if (order.discountType === 'PERCENT') {
        amount -= (amount * dValue) / 100;
      } else if (order.discountType === 'FIXED') {
        amount -= dValue;
      }
      totalRevenue += Math.max(0, amount);
    }

    return {
      totalRevenue,
      totalOrders: orders.length,
      firstOrderDate: orders.length > 0 ? orders[0].createdAt : null,
      lastOrderDate: orders.length > 0 ? orders[orders.length - 1].createdAt : null,
    };
  }

  // ----------------------------------------
  // Existing top products (by quantity) giữ nguyên
  // ----------------------------------------
  async getTopProducts(take = 5) {
    const topProductItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { status: OrderStatus.COMPLETED },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take,
    });

    const productIds = topProductItems.map((p) => p.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { where: { isPrimary: true } } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    return topProductItems.map((item) => {
      const product = productMap.get(item.productId);
      return {
        ...product,
        totalSold: item._sum.quantity ?? 0,
      };
    });
  }

  // ==========================
  // Task 7.10: Revenue chart data
  // ==========================
  async revenue({
    from,
    to,
    groupBy = 'day',
  }: {
    from?: string;
    to?: string;
    groupBy?: GroupBy;
  }) {
    // chỉ tính order COMPLETED để revenue đúng
    const where: any = { status: OrderStatus.COMPLETED };

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      select: {
        createdAt: true,
        totalAmount: true,
        discountType: true,
        discountValue: true,
      },
    });

    const map = new Map<string, number>();

    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = this.makeBucketKey(d, groupBy);

      // Prisma Decimal -> number
      let amount = Number((o as any).totalAmount ?? 0);
      const dValue = Number((o as any).discountValue ?? 0);

      if (o.discountType === 'PERCENT') {
        amount -= (amount * dValue) / 100;
      } else if (o.discountType === 'FIXED') {
        amount -= dValue;
      }
      amount = Math.max(0, amount);

      map.set(key, (map.get(key) || 0) + amount);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }));
  }

  // ==========================
  // Task 7.10: Order trends (count orders)
  // ==========================
  async ordersTrend({
    from,
    to,
    groupBy = 'day',
  }: {
    from?: string;
    to?: string;
    groupBy?: GroupBy;
  }) {
    const where: any = { status: OrderStatus.COMPLETED };

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      select: { createdAt: true },
    });

    const map = new Map<string, number>();

    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = this.makeBucketKey(d, groupBy);
      map.set(key, (map.get(key) || 0) + 1);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, orders]) => ({ date, orders }));
  }

  // ==========================
  // Task 7.10: Top products pie (by revenue)
  // ==========================
  async topProducts({
    from,
    to,
    take,
  }: {
    from?: string;
    to?: string;
    take?: string;
  }) {
    // Use findMany to calculate net revenue per product (proportional discount)
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && {
            lte: (() => {
              const d = new Date(to);
              d.setUTCHours(23, 59, 59, 999);
              return d;
            })(),
          }),
        },
      },
      include: { items: true },
    });

    const productStats = new Map<string, { revenue: number; quantity: number }>();

    for (const order of orders) {
      const rawTotal = Number(order.totalAmount);
      let orderDiscount = 0;
      if (order.discountType === 'PERCENT') {
        orderDiscount = (rawTotal * Number(order.discountValue)) / 100;
      } else if (order.discountType === 'FIXED') {
        orderDiscount = Number(order.discountValue);
      }
      const netTotal = Math.max(0, rawTotal - orderDiscount);

      // Calculate ratio to distribute revenue
      const ratio = rawTotal > 0 ? netTotal / rawTotal : 1;

      for (const item of order.items) {
        const itemRevenue = Number(item.totalPrice) * ratio;

        const current = productStats.get(item.productId) || { revenue: 0, quantity: 0 };
        current.revenue += itemRevenue;
        current.quantity += item.quantity;
        productStats.set(item.productId, current);
      }
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: Array.from(productStats.keys()) } },
      select: { id: true, name: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p.name]));

    const topN = take ? Math.max(1, parseInt(take, 10) || 10) : 10;

    return Array.from(productStats.entries())
      .map(([productId, stats]) => ({
        name: productMap.get(productId) || 'Unknown',
        value: stats.revenue,
        quantity: stats.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }

  // ==========================
  // Task 7.10: Top categories pie (by revenue)
  // ==========================
  async topCategories({
    from,
    to,
    take,
  }: {
    from?: string;
    to?: string;
    take?: string;
  }) {
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && {
            lte: (() => {
              const d = new Date(to);
              d.setUTCHours(23, 59, 59, 999);
              return d;
            })(),
          }),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    const categoryStats = new Map<string, { name: string; revenue: number; quantity: number }>();

    for (const order of orders) {
      const rawTotal = Number(order.totalAmount);
      let orderDiscount = 0;
      if (order.discountType === 'PERCENT') {
        orderDiscount = (rawTotal * Number(order.discountValue)) / 100;
      } else if (order.discountType === 'FIXED') {
        orderDiscount = Number(order.discountValue);
      }
      const netTotal = Math.max(0, rawTotal - orderDiscount);

      const ratio = rawTotal > 0 ? netTotal / rawTotal : 1;

      for (const item of order.items) {
        // Skip if product or category was deleted (though relations should prevent this usually)
        if (!item.product || !item.product.category) continue;

        const itemRevenue = Number(item.totalPrice) * ratio;
        const categoryName = item.product.category.name;

        const current = categoryStats.get(categoryName) || { name: categoryName, revenue: 0, quantity: 0 };
        current.revenue += itemRevenue;
        current.quantity += item.quantity;
        categoryStats.set(categoryName, current);
      }
    }

    const topN = take ? Math.max(1, parseInt(take, 10) || 10) : 10;

    return Array.from(categoryStats.values())
      .map((stats) => ({
        name: stats.name,
        value: stats.revenue,
        quantity: stats.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }

  // ----------------------------
  // helpers
  // ----------------------------
  private makeBucketKey(date: Date, groupBy: GroupBy): string {
    const d = new Date(date);

    if (groupBy === 'day') {
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    if (groupBy === 'week') {
      // lấy ngày Chủ nhật (start of week theo JS getDay)
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      return start.toISOString().slice(0, 10);
    }

    // month: YYYY-MM
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${m}`;
  }
}
