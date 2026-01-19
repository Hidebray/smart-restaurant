"use client";

import { ProductAnalytics } from "@/types/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TopProductsChartProps {
  data: ProductAnalytics;
}

export default function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.topProducts.map((product) => ({
    name: product.productName.length > 20 
      ? product.productName.substring(0, 20) + "..." 
      : product.productName,
    revenue: product.revenue,
    quantity: product.quantity,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Sản Phẩm Bán Chạy</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: "#374151" }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#f59e0b" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng sản phẩm đã bán</div>
          <div className="text-lg font-bold text-gray-900">{data.totalProductsSold}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng số lượng</div>
          <div className="text-lg font-bold text-gray-900">{data.totalItemsSold}</div>
        </div>
      </div>
    </div>
  );
}
