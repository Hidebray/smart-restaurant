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
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/admin/reports"
            className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-2 inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue Reports</h1>
        </div>

        {/* Filters */}
        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-200 gap-3 items-center">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase">From</span>
            <input
              type="date"
              className="text-sm border-none focus:ring-0 p-0 text-gray-700 font-medium bg-transparent"
              value={range.from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
            />
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase">To</span>
            <input
              type="date"
              className="text-sm border-none focus:ring-0 p-0 text-gray-700 font-medium bg-transparent"
              value={range.to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
            />
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <select
            className="text-sm font-semibold text-gray-700 border-none focus:ring-0 bg-transparent cursor-pointer"
            value={range.groupBy}
            onChange={(e) => setRange((r) => ({ ...r, groupBy: e.target.value }))}
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
          <button
            onClick={load}
            className="ml-2 px-5 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95 text-sm"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Income Analysis</h2>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Total Revenue
            </span>
          </div>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100/50">
            <RevenueLineChart data={revenue} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Top Categories</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full">
              <TopProductsPieChart data={topProducts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
