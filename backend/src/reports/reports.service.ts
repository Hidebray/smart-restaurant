import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type GroupBy = 'day' | 'week' | 'month';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------
  // Existing summary (giữ nguyên)
  // ----------------------------
  async getSummary(from?: string, to?: string) {
    const whereClause: any = { status: OrderStatus.COMPLETED };

    if (from || to) {
      whereClause.createdAt = {};
      if (from) whereClause.createdAt.gte = new Date(from);
      if (to) whereClause.createdAt.lte = new Date(to);
    }

    const aggregates = await this.prisma.order.aggregate({
      where: whereClause,
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const firstOrder = await this.prisma.order.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });

    const lastOrder = await this.prisma.order.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalRevenue: aggregates._sum.totalAmount ?? 0,
      totalOrders: aggregates._count.id ?? 0,
      firstOrderDate: firstOrder?.createdAt ?? null,
      lastOrderDate: lastOrder?.createdAt ?? null,
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
      if (to) where.createdAt.lte = new Date(to);
    }

    const orders = await this.prisma.order.findMany({
      where,
      select: {
        createdAt: true,
        totalAmount: true, // ✅ đúng field theo schema bạn
      },
    });

    const map = new Map<string, number>();

    for (const o of orders) {
      const d = new Date(o.createdAt);
      const key = this.makeBucketKey(d, groupBy);

      // Prisma Decimal -> number
      const amount = Number((o as any).totalAmount ?? 0);

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
      if (to) where.createdAt.lte = new Date(to);
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
    const where: any = {
      order: { status: OrderStatus.COMPLETED },
    };

    if (from || to) {
      where.order = {
        ...where.order,
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      };
    }

    // ✅ OrderItem sum fields hợp lệ theo lỗi bạn gửi: quantity/unitPrice/totalPrice
    const grouped = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where,
      _sum: { totalPrice: true }, // ✅ đúng field (không có price)
    });

    const products = await this.prisma.product.findMany({
      select: { id: true, name: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p.name]));

    const topN = take ? Math.max(1, parseInt(take, 10) || 10) : 10;

    return grouped
      .map((g) => ({
        name: productMap.get(g.productId) || 'Unknown',
        value: Number(g._sum?.totalPrice ?? 0),
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
