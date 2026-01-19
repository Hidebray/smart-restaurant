"use client";

import { ReservationAnalytics } from "@/types/analytics";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReservationChartProps {
  data: ReservationAnalytics;
}

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#6b7280"];

export default function ReservationChart({ data }: ReservationChartProps) {
  const chartData = [
    { name: "Đã xác nhận", value: data.confirmed, color: COLORS[0] },
    { name: "Hoàn thành", value: data.completed, color: COLORS[1] },
    { name: "Đã hủy", value: data.cancelled, color: COLORS[2] },
    { name: "Không đến", value: data.noShow, color: COLORS[3] },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Phân Tích Đặt Bàn</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Tổng đặt bàn</div>
          <div className="text-lg font-bold text-gray-900">{data.totalReservations}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Tỷ lệ không đến</div>
          <div className="text-lg font-bold text-red-600">{data.noShowRate.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
          <div className="text-lg font-bold text-green-600">{data.completed}</div>
        </div>
      </div>
    </div>
  );
}
