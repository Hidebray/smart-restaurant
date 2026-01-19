"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { analyticsApi, DashboardAnalytics, AnalyticsPeriod } from "@/lib/api/analytics";
import RevenueChart from "@/components/analytics/RevenueChart";
import CustomerGrowthChart from "@/components/analytics/CustomerGrowthChart";
import TopProductsChart from "@/components/analytics/TopProductsChart";
import ReservationChart from "@/components/analytics/ReservationChart";
import { DollarSign, Users, Package, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("week");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: analytics, error, mutate } = useSWR<DashboardAnalytics>(
    ["analytics-dashboard", period, startDate, endDate],
    () =>
      analyticsApi.getDashboard({
        period,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  );

  useEffect(() => {
    mutate();
  }, [period, startDate, endDate, mutate]);

  if (error) return <div className="p-8">Failed to load analytics</div>;
  if (!analytics) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Phân Tích & Báo Cáo</h1>
          <p className="text-sm text-gray-700">
            Xem thống kê và phân tích hiệu suất nhà hàng
          </p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Khoảng thời gian:</label>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value as AnalyticsPeriod);
                setStartDate("");
                setEndDate("");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">1 năm qua</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>

          {period === "custom" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Từ:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Đến:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="text-sm text-gray-600">
            {format(new Date(analytics.period.startDate), "dd/MM/yyyy", { locale: vi })} -{" "}
            {format(new Date(analytics.period.endDate), "dd/MM/yyyy", { locale: vi })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Tổng Doanh Thu</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(analytics.revenue.totalRevenue)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.revenue.orderCount} đơn hàng
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Khách Hàng</div>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics.customers.totalCustomers}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.customers.newCustomers} mới
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Sản Phẩm</div>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics.products.totalProductsSold}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.products.totalItemsSold} sản phẩm đã bán
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Sử Dụng Bàn</div>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics.tables.tableUtilization.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.tables.usedTables}/{analytics.tables.totalTables} bàn
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart data={analytics.revenue} />
        <CustomerGrowthChart data={analytics.customers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopProductsChart data={analytics.products} />
        <ReservationChart data={analytics.reservations} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Giá Trị Đơn Hàng Trung Bình</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(analytics.revenue.averageOrderValue)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Thời Gian Bàn Trung Bình</div>
          <div className="text-2xl font-bold text-gray-900">
            {analytics.tables.averageTableTime} phút
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Tỷ Lệ Không Đến</div>
          <div className="text-2xl font-bold text-red-600">
            {analytics.reservations.noShowRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
