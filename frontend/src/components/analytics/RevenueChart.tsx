"use client";

import { RevenueAnalytics } from "@/types/analytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface RevenueChartProps {
  data: RevenueAnalytics;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.revenueByDate.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: vi }),
    revenue: item.value,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh Thu Theo Ngày</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: "#374151" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Doanh thu"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng doanh thu</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(data.totalRevenue)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Số đơn hàng</div>
          <div className="text-lg font-bold text-gray-900">{data.orderCount}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Giá trị trung bình</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(data.averageOrderValue)}
          </div>
        </div>
      </div>
    </div>
  );
}
