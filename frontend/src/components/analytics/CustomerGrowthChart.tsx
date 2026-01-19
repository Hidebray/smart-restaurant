"use client";

import { CustomerAnalytics } from "@/types/analytics";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface CustomerGrowthChartProps {
  data: CustomerAnalytics;
}

export default function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
  const chartData = data.customerGrowth.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: vi }),
    customers: item.value,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Tăng Trưởng Khách Hàng</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip labelStyle={{ color: "#374151" }} />
          <Legend />
          <Bar dataKey="customers" fill="#10b981" name="Khách hàng mới" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng khách hàng</div>
          <div className="text-lg font-bold text-gray-900">{data.totalCustomers}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Khách hàng mới</div>
          <div className="text-lg font-bold text-green-600">{data.newCustomers}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Khách quay lại</div>
          <div className="text-lg font-bold text-blue-600">{data.returningCustomers}</div>
        </div>
      </div>
    </div>
  );
}
