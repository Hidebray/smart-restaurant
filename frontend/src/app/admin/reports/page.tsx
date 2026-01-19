"use client";

import { useState } from "react";
import useSWR from "swr";
import { getSummary, getTopProducts, reportsApi } from "@/lib/api/reports";
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
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Calendar, DollarSign, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  isCurrency = false,
  colorClass = "text-gray-800",
  bgClass = "bg-white",
}: {
  title: string;
  value: number | string;
  icon: any;
  isCurrency?: boolean;
  colorClass?: string;
  bgClass?: string;
}) => (
  <Card className={`p-6 ${bgClass} border-none shadow-sm`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">
          {typeof value === 'number' ? (isCurrency ? currencyFormatter.format(value) : value) : value}
        </h3>
      </div>
    </div>
  </Card>
);

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: summary, error: summaryError } = useSWR(
    [`/reports/summary`, fromDate, toDate],
    () => getSummary(fromDate, toDate),
  );
  const { data: topProducts, error: topProductsError } = useSWR(
    [`/reports/top-products`, fromDate, toDate],
    () => reportsApi.topProducts({ from: fromDate, to: toDate, take: 5 }),
  );

  const isLoading = !summary && !summaryError && !topProducts && !topProductsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (summaryError || topProductsError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500">Failed to load reports. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Summary</h1>
          <p className="text-gray-500 mt-1">Overview of restaurant performance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-0.5">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 leading-none"
              />
            </div>
          </div>

          <div className="w-px bg-gray-200 my-1"></div>

          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-0.5">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-semibold text-gray-700 focus:ring-0 leading-none"
              />
            </div>
          </div>

          <Link
            href="/admin/reports/revenue"
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95 ml-2"
          >
            Detailed Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={summary?.totalRevenue ?? 0}
          icon={DollarSign}
          isCurrency
          colorClass="text-green-600"
          bgClass="bg-white"
        />
        <SummaryCard
          title="Total Orders"
          value={summary?.totalOrders ?? 0}
          icon={ShoppingBag}
          colorClass="text-blue-600"
          bgClass="bg-white"
        />
        <SummaryCard
          title="Avg. Order Value"
          value={summary?.totalOrders > 0 ? (summary?.totalRevenue / summary?.totalOrders) : 0}
          icon={TrendingUp}
          isCurrency
          colorClass="text-purple-600"
          bgClass="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Period Info Card */}
        <Card className="p-6 border-none shadow-sm lg:col-span-1 h-full flex flex-col justify-center bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
          <h3 className="text-lg font-bold text-orange-900 mb-2">Reporting Period</h3>
          <div className="text-3xl font-black text-orange-600 leading-tight">
            {summary?.firstOrderDate
              ? new Date(summary.firstOrderDate).toLocaleDateString('vi-VN')
              : "N/A"}
          </div>
          <div className="text-sm font-medium text-orange-400 my-2">to</div>
          <div className="text-3xl font-black text-orange-600 leading-tight">
            {summary?.lastOrderDate
              ? new Date(summary.lastOrderDate).toLocaleDateString('vi-VN')
              : "N/A"}
          </div>
          <p className="text-sm text-orange-800/60 mt-4">
            Data reflects completed orders within this date range.
          </p>
        </Card>

        {/* Top Product Chart */}
        <Card className="p-6 border-none shadow-sm lg:col-span-2 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Top 5 Selling Items
            </h2>
            <Link href="/admin/reports/revenue" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View Full Report
            </Link>
          </div>

          {topProducts && topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "12px"
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#f97316"
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-gray-400 font-medium">No sales data found for this period.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
