export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface RevenueAnalytics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  revenueByDate: Array<{ date: string; value: number }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: Array<{ date: string; value: number }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ProductAnalytics {
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  totalProductsSold: number;
  totalItemsSold: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TableAnalytics {
  totalTables: number;
  usedTables: number;
  tableUtilization: number;
  averageTableTime: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ReservationAnalytics {
  totalReservations: number;
  confirmed: number;
  cancelled: number;
  noShow: number;
  completed: number;
  noShowRate: number;
  reservationByDate: Array<{ date: string; value: number }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface DashboardAnalytics {
  revenue: RevenueAnalytics;
  customers: CustomerAnalytics;
  products: ProductAnalytics;
  tables: TableAnalytics;
  reservations: ReservationAnalytics;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface AnalyticsSnapshot {
  id: string;
  date: string;
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  customerCount: number;
  newCustomers: number;
  returningCustomers: number;
  topProductId?: string;
  topProductSales: number;
  tableUtilization: number;
  averageTableTime: number;
  reservationCount: number;
  reservationNoShowRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAnalyticsParams {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
