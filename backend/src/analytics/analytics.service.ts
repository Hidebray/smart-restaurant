import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetAnalyticsDto, AnalyticsPeriod } from './dto/get-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(dto: GetAnalyticsDto) {
    const { startDate, endDate } = this.getDateRange(dto);

    const orders = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
        discountValue: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount) - Number(order.discountValue || 0),
      0,
    );

    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Group by date for chart data
    const revenueByDate = this.groupByDate(
      orders,
      (order) => order.createdAt,
      (order) => Number(order.totalAmount) - Number(order.discountValue || 0),
    );

    return {
      totalRevenue,
      orderCount,
      averageOrderValue,
      revenueByDate,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(dto: GetAnalyticsDto) {
    const { startDate, endDate } = this.getDateRange(dto);

    const allCustomers = await this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        createdAt: {
          lte: endDate,
        },
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            status: 'COMPLETED',
          },
        },
      },
    });

    const newCustomers = allCustomers.filter(
      (customer) => customer.createdAt >= startDate,
    ).length;

    const returningCustomers = allCustomers.filter(
      (customer) => customer.orders.length > 0 && customer.createdAt < startDate,
    ).length;

    const customerGrowth = this.groupByDate(
      allCustomers.filter((c) => c.createdAt >= startDate),
      (customer) => customer.createdAt,
      () => 1,
    );

    return {
      totalCustomers: allCustomers.length,
      newCustomers,
      returningCustomers,
      customerGrowth,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(dto: GetAnalyticsDto) {
    const { startDate, endDate } = this.getDateRange(dto);

    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    // Group by product
    const productSales = orderItems.reduce((acc, item) => {
      const productId = item.productId;
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: item.product.name,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[productId].quantity += item.quantity;
      acc[productId].revenue += Number(item.product.price) * item.quantity;
      return acc;
    }, {} as Record<string, { productId: string; productName: string; quantity: number; revenue: number }>);

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      topProducts,
      totalProductsSold: Object.keys(productSales).length,
      totalItemsSold: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get table analytics
   */
  async getTableAnalytics(dto: GetAnalyticsDto) {
    const { startDate, endDate } = this.getDateRange(dto);

    const orders = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        table: true,
      },
    });

    const totalTables = await this.prisma.table.count();
    const usedTables = new Set(orders.map((o) => o.tableId)).size;
    const tableUtilization = totalTables > 0 ? (usedTables / totalTables) * 100 : 0;

    // Calculate average table time (simplified - would need order completion time)
    const averageTableTime = 90; // Default 90 minutes

    return {
      totalTables,
      usedTables,
      tableUtilization,
      averageTableTime,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get reservation analytics
   */
  async getReservationAnalytics(dto: GetAnalyticsDto) {
    const { startDate, endDate } = this.getDateRange(dto);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalReservations = reservations.length;
    const confirmed = reservations.filter((r) => r.status === 'CONFIRMED').length;
    const cancelled = reservations.filter((r) => r.status === 'CANCELLED').length;
    const noShow = reservations.filter((r) => r.status === 'NO_SHOW').length;
    const completed = reservations.filter((r) => r.status === 'COMPLETED').length;

    const noShowRate =
      totalReservations > 0 ? (noShow / totalReservations) * 100 : 0;

    const reservationByDate = this.groupByDate(
      reservations,
      (res) => res.reservationDate,
      () => 1,
    );

    return {
      totalReservations,
      confirmed,
      cancelled,
      noShow,
      completed,
      noShowRate,
      reservationByDate,
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get comprehensive dashboard analytics
   */
  async getDashboardAnalytics(dto: GetAnalyticsDto) {
    const [revenue, customers, products, tables, reservations] = await Promise.all([
      this.getRevenueAnalytics(dto),
      this.getCustomerAnalytics(dto),
      this.getProductAnalytics(dto),
      this.getTableAnalytics(dto),
      this.getReservationAnalytics(dto),
    ]);

    return {
      revenue,
      customers,
      products,
      tables,
      reservations,
      period: {
        startDate: dto.startDate || this.getDefaultStartDate(dto.period || AnalyticsPeriod.WEEK),
        endDate: dto.endDate || new Date(),
      },
    };
  }

  /**
   * Get date range based on period
   */
  private getDateRange(dto: GetAnalyticsDto): { startDate: Date; endDate: Date } {
    const endDate = dto.endDate ? new Date(dto.endDate) : new Date();
    let startDate: Date;

    if (dto.startDate) {
      startDate = new Date(dto.startDate);
    } else {
      startDate = this.getDefaultStartDate(dto.period || AnalyticsPeriod.WEEK);
    }

    return { startDate, endDate };
  }

  /**
   * Get default start date based on period
   */
  private getDefaultStartDate(period: AnalyticsPeriod): Date {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case AnalyticsPeriod.DAY:
        startDate.setHours(0, 0, 0, 0);
        break;
      case AnalyticsPeriod.WEEK:
        startDate.setDate(now.getDate() - 7);
        break;
      case AnalyticsPeriod.MONTH:
        startDate.setMonth(now.getMonth() - 1);
        break;
      case AnalyticsPeriod.YEAR:
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return startDate;
  }

  /**
   * Group data by date for chart visualization
   */
  private groupByDate<T>(
    data: T[],
    getDate: (item: T) => Date,
    getValue: (item: T) => number,
  ): Array<{ date: string; value: number }> {
    const grouped = data.reduce((acc, item) => {
      const date = getDate(item);
      const dateKey = date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += getValue(item);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Create daily analytics snapshot
   */
  async createDailySnapshot(date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [revenue, customers, products, tables, reservations] = await Promise.all([
      this.getRevenueAnalytics({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      }),
      this.getCustomerAnalytics({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      }),
      this.getProductAnalytics({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      }),
      this.getTableAnalytics({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      }),
      this.getReservationAnalytics({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      }),
    ]);

    const topProduct = products.topProducts[0];

    return this.prisma.analyticsSnapshot.upsert({
      where: { date: startOfDay },
      update: {
        totalRevenue: new Prisma.Decimal(revenue.totalRevenue),
        orderCount: revenue.orderCount,
        averageOrderValue: new Prisma.Decimal(revenue.averageOrderValue),
        customerCount: customers.totalCustomers,
        newCustomers: customers.newCustomers,
        returningCustomers: customers.returningCustomers,
        topProductId: topProduct?.productId || null,
        topProductSales: topProduct?.quantity || 0,
        tableUtilization: new Prisma.Decimal(tables.tableUtilization),
        averageTableTime: tables.averageTableTime,
        reservationCount: reservations.totalReservations,
        reservationNoShowRate: new Prisma.Decimal(reservations.noShowRate),
      },
      create: {
        date: startOfDay,
        totalRevenue: new Prisma.Decimal(revenue.totalRevenue),
        orderCount: revenue.orderCount,
        averageOrderValue: new Prisma.Decimal(revenue.averageOrderValue),
        customerCount: customers.totalCustomers,
        newCustomers: customers.newCustomers,
        returningCustomers: customers.returningCustomers,
        topProductId: topProduct?.productId || null,
        topProductSales: topProduct?.quantity || 0,
        tableUtilization: new Prisma.Decimal(tables.tableUtilization),
        averageTableTime: tables.averageTableTime,
        reservationCount: reservations.totalReservations,
        reservationNoShowRate: new Prisma.Decimal(reservations.noShowRate),
      },
    });
  }

  /**
   * Get historical snapshots
   */
  async getHistoricalSnapshots(limit = 30) {
    return this.prisma.analyticsSnapshot.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}
