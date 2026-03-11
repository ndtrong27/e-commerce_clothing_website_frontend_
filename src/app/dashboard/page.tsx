"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Clock,
    Package
} from 'lucide-react';
import { clsx } from 'clsx';
import { fetchAdminDashboardStats } from '@/services/api';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        total_sales: number;
        total_orders: number;
        total_products: number;
        total_users: number;
        recent_orders: any[];
    }>({
        total_sales: 0,
        total_orders: 0,
        total_products: 0,
        total_users: 0,
        recent_orders: []
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const stats = await fetchAdminDashboardStats();
                setData(stats);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const stats = [
        {
            label: 'Total Revenue',
            value: `$${Number(data.total_sales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: '-', // backend doesn't provide historical changes yet
            trend: 'up',
            icon: DollarSign,
            color: 'emerald'
        },
        {
            label: 'Total Orders',
            value: data.total_orders.toLocaleString(),
            change: '-',
            trend: 'up',
            icon: ShoppingBag,
            color: 'cyan'
        },
        {
            label: 'Total Users',
            value: data.total_users.toLocaleString(),
            change: '-',
            trend: 'up',
            icon: Users,
            color: 'indigo'
        },
        {
            label: 'Total Products',
            value: data.total_products.toLocaleString(),
            change: '-',
            trend: 'up',
            icon: Package,
            color: 'amber'
        },
    ];
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-3xl hover:border-emerald-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        {/* Liquid Background Glow */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700" />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                stat.color === 'emerald' ? "bg-emerald-500/20 text-emerald-400" :
                                    stat.color === 'cyan' ? "bg-cyan-500/20 text-cyan-400" :
                                        stat.color === 'indigo' ? "bg-indigo-500/20 text-indigo-400" :
                                            "bg-amber-500/20 text-amber-400"
                            )}>
                                <stat.icon size={24} />
                            </div>
                            <div className={clsx(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                                stat.trend === 'up' ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder - Liquid Glass */}
                <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Sales Performance</h3>
                            <p className="text-slate-400 text-sm">Monthly overview of revenue and order volume.</p>
                        </div>
                        <select className="bg-slate-800 border-none rounded-xl text-slate-100 text-xs font-bold px-4 py-2 cursor-pointer focus:ring-2 ring-emerald-500/20 outline-none">
                            <option>Last 30 Days</option>
                            <option>Year to Date</option>
                        </select>
                    </div>

                    {/* Mock Chart Visualization */}
                    <div className="h-64 flex flex-col justify-end gap-2 px-2">
                        <div className="flex items-end justify-between h-full gap-3">
                            {[40, 65, 45, 80, 55, 90, 75, 60, 85, 45, 70, 95].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="w-full bg-slate-800 group-hover:bg-emerald-500/50 rounded-t-lg transition-all duration-500 cursor-help"
                                    />
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg shadow-emerald-500/50">
                                        ${(h * 150).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-800/50 pt-4 flex justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider overflow-hidden">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Trending Categories */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white">Trending Now</h3>
                        <button className="text-slate-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Outerwear', share: 45, trending: '+12%', color: 'bg-emerald-500' },
                            { label: 'Accessories', share: 22, trending: '+5%', color: 'bg-cyan-500' },
                            { label: 'Footwear', share: 18, trending: '+2%', color: 'bg-indigo-500' },
                            { label: 'Loungewear', share: 15, trending: '-1%', color: 'bg-slate-700' },
                        ].map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white font-medium">{cat.label}</span>
                                    <span className="text-slate-400 font-bold">{cat.share}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${cat.share}%` }}
                                        className={clsx("h-full rounded-full transition-all duration-1000", cat.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-800/50">
                        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-4 rounded-2xl border border-emerald-500/10">
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pro Tip</p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                Outerwear sales are up <span className="text-emerald-400 font-bold">12%</span> this week. Consider featuring coats in your next campaign.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table - Liquid Glass Styling */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Recent Activity</h3>
                        <p className="text-slate-400 text-sm">Real-time feed of latest store interactions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"><Clock size={18} /></button>
                        <button className="px-4 py-2 rounded-xl bg-slate-800 text-slate-100 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer">View All</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-950/30">
                                <th className="px-8 py-4">Transaction</th>
                                <th className="px-8 py-4">Customer</th>
                                <th className="px-8 py-4 text-center">Status</th>
                                <th className="px-8 py-4">Time</th>
                                <th className="px-8 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-8 text-center text-slate-500">Loading recent activity...</td>
                                </tr>
                            ) : data.recent_orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-8 text-center text-slate-500">No recent orders found.</td>
                                </tr>
                            ) : data.recent_orders.map((order: any, i: number) => (
                                <tr
                                    key={i}
                                    className="group hover:bg-emerald-500/[0.03] transition-colors cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold font-mono">{order.id.substring(0, 8)}...</div>
                                                <div className="text-slate-500 text-xs text-center">{/* No product data in overview object */}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-300 font-medium">{order.user_name || 'Guest'}</div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            order.status === 'Paid' || order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-400" :
                                                order.status === 'Shipped' ? "bg-cyan-500/10 text-cyan-400" :
                                                    order.status === 'Processing' ? "bg-indigo-500/10 text-indigo-400" :
                                                        "bg-amber-500/10 text-amber-400"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-500 text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-white font-mono">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
