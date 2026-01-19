"use client";

import { useState } from "react";

import useSWR from "swr";
import { getSummary, getTopProducts } from "@/lib/api/reports";
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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const SummaryCard = ({
  title,
  value,
  isCurrency = false,
}: {
  title: string;
  value: number;
  isCurrency?: boolean;
}) => (
  <Card className="p-6">
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">
      {isCurrency ? currencyFormatter.format(value) : value}
    </p>
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
    "/reports/top-products",
    () => getTopProducts(5),
  );

  const isLoading =
    !summary && !summaryError && !topProducts && !topProductsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (summaryError || topProductsError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-red-500">Failed to load reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <Link
          href="/admin/reports/revenue"
          className="px-4 py-2 rounded bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700"
        >
          Revenue Reports →
        </Link>
        <div className="flex gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={summary?.totalRevenue ?? 0}
          isCurrency
        />
        <SummaryCard title="Total Orders" value={summary?.totalOrders ?? 0} />
        <Card className="p-6 col-span-1 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-500">Period</h3>
          <p className="text-xl font-bold text-gray-800">
            {summary?.firstOrderDate
              ? new Date(summary.firstOrderDate).toLocaleDateString()
              : "N/A"}{" "}
            -{" "}
            {summary?.lastOrderDate
              ? new Date(summary.lastOrderDate).toLocaleDateString()
              : "N/A"}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Top Selling Products
        </h2>
        {topProducts && topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Legend />
              <Bar dataKey="totalSold" fill="#3b82f6" name="Total Sold" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">No product data available.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
