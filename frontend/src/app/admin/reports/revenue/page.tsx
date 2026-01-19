"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reportsApi } from "@/lib/api/reports";
import RevenueLineChart from "@/components/charts/RevenueLineChart";
import TopProductsPieChart from "@/components/charts/TopProductsPieChart";

export default function RevenueReportPage() {
  const [range, setRange] = useState({ from: "", to: "", groupBy: "day" });
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const load = async () => {
    setRevenue(await reportsApi.revenue(range));
    setTopProducts(await reportsApi.topProducts(range));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Link
        href="/admin/reports"
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to Reports
      </Link>
      <h1 className="text-2xl font-bold">Revenue Reports</h1>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="date"
          onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
        />
        <input
          type="date"
          onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
        />
        <select
          onChange={(e) => setRange((r) => ({ ...r, groupBy: e.target.value }))}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
        <button
          onClick={load}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Apply
        </button>
      </div>

      {/* Charts */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Revenue Trend</h2>
        <RevenueLineChart data={revenue} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Top Products</h2>
        <TopProductsPieChart data={topProducts} />
      </div>
    </div>
  );
}
