"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    Eye, 
    Download, 
    MoreVertical, 
    Calendar,
    Clock,
    Truck,
    CheckCircle2,
    AlertCircle,
    Banknote,
    TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchAdminOrders } from '@/services/api';

const statusStyles = {
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
    'Processing': 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    'Shipped': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/5',
    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    'Cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5',
};

const statusIcons = {
    'Pending': Clock,
    'Processing': TrendingUp,
    'Shipped': Truck,
    'Delivered': CheckCircle2,
    'Cancelled': AlertCircle,
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, [searchTerm, meta.page]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            // For now status filter is not hooked up to a state, using undefined
            const response = await fetchAdminOrders({ 
                page: meta.page, 
                limit: meta.limit 
            });
            setOrders(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-8">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Orders', value: meta.total.toString(), icon: Banknote, color: 'emerald', trend: '' },
                    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length.toString(), icon: ShoppingBag, color: 'blue', trend: '' },
                    { label: 'Avg. Order Value', value: '...', icon: TrendingUp, color: 'indigo', trend: '' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-all group shadow-lg">
                        <div className="flex items-center gap-5">
                            <div className={twMerge(
                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10" :
                                stat.color === 'blue' ? "bg-blue-500/10 text-blue-400 shadow-blue-500/10" :
                                "bg-indigo-500/10 text-indigo-400 shadow-indigo-500/10"
                            )}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold font-mono text-white tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                        <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders Table Card */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/20">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find orders by ID or customer name..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/50 transition-all cursor-pointer font-medium text-sm">
                            <Calendar size={18} />
                            Last 30 Days
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/50 transition-all cursor-pointer font-medium text-sm">
                            <Filter size={18} />
                            Status
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/30">
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Order Details</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No orders found.</td>
                                </tr>
                            ) : orders.map((order) => {
                                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Clock;
                                return (
                                    <tr key={order.id} className="hover:bg-indigo-500/5 transition-all group cursor-default">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-slate-100 font-bold group-hover:text-indigo-400 transition-colors font-mono">{order.id.substring(0, 8)}...</div>
                                                <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                                                    <Calendar size={12} />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-200 font-medium">{order.user_email || 'Guest'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 font-mono text-sm">-- items</td>
                                        <td className="px-6 py-4 text-slate-200 font-mono font-medium">${Number(order.total_amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <div className={twMerge(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
                                                statusStyles[order.status as keyof typeof statusStyles] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            )}>
                                                <StatusIcon size={14} />
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all cursor-pointer title='View Details'">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all cursor-pointer title='Download Invoice'">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all cursor-pointer">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-800/50 flex items-center justify-between text-slate-500 text-sm bg-slate-950/10">
                    <p>Showing {orders.length} of {meta.total} orders</p>
                    <div className="flex items-center gap-2">
                        <button 
                            className="px-4 py-2 bg-slate-800/50 disabled:opacity-50 hover:bg-slate-800 text-slate-300 transition-all rounded-xl cursor-pointer"
                            onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={meta.page === 1}
                        >Previous</button>
                        <button 
                            className="px-4 py-2 bg-indigo-500 text-white disabled:opacity-50 disabled:bg-indigo-500/50 rounded-xl font-bold cursor-pointer hover:bg-indigo-400 transition-all"
                            onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={orders.length < meta.limit}
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fixed missing import
import { ShoppingBag } from 'lucide-react';
