"use client";

import { useI18n } from "@/contexts/I18nContext";
import {
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Clock,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
    const { t } = useI18n();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeTables: 0,
        onlineStaff: 0
    });

    // Mock data fetching
    useEffect(() => {
        // In a real app, this would be an API call
        setStats({
            totalOrders: 156,
            totalRevenue: 12500000,
            activeTables: 8,
            onlineStaff: 12
        });
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const statCards = [
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-100",
            trend: "+12%"
        },
        {
            title: "Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
            trend: "+8%"
        },
        {
            title: "Active Tables",
            value: stats.activeTables,
            icon: Users,
            color: "text-orange-600",
            bg: "bg-orange-100",
            trend: "Now"
        },
        {
            title: "Online Staff",
            value: stats.onlineStaff,
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-100",
            trend: "Now"
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 font-medium flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stat.trend}
                            </span>
                            <span className="text-gray-400 ml-2">vs last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-800 mt-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/products" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                <ShoppingBag className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Manage Menu</h3>
                                <p className="text-sm text-gray-500">Update items & prices</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </div>
                </Link>

                <Link href="/admin/tables" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Manage Tables</h3>
                                <p className="text-sm text-gray-500">QR codes & status</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                </Link>

                <Link href="/admin/staff" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Manage Staff</h3>
                                <p className="text-sm text-gray-500">Roles & accounts</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
