"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    MoreHorizontal, 
    Plus,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Package,
    Tag
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchAdminProducts } from '@/services/api';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, [searchTerm, meta.page]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await fetchAdminProducts({ 
                page: meta.page, 
                limit: meta.limit, 
                search: searchTerm || undefined 
            });
            setProducts(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Products', value: meta.total.toString(), icon: Package, color: 'emerald' },
                    { label: 'Active Categories', value: '...', icon: Tag, color: 'blue' },
                    { label: 'Low Stock Items', value: products.filter(p => p.stock_quantity < 20).length.toString(), icon: ArrowUpDown, color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl flex items-center gap-5 hover:border-emerald-500/30 transition-all group">
                        <div className={twMerge(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                            stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400" :
                            stat.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                            "bg-rose-500/10 text-rose-400"
                        )}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold font-mono text-white tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                {/* Search & Bulk Actions */}
                <div className="p-6 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products by name, ID or category..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/50 transition-all cursor-pointer font-medium text-sm">
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/30">
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No products found.</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-emerald-500/5 transition-all group cursor-default">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700/50 group-hover:border-emerald-500/30 transition-colors">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-slate-100 font-bold group-hover:text-emerald-400 transition-colors">{product.name}</div>
                                                <div className="text-slate-500 text-xs font-mono">{product.id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/50">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-200 font-mono font-medium">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={twMerge(
                                            "font-mono font-medium",
                                            product.stock_quantity < 20 ? "text-rose-400" : "text-slate-300"
                                        )}>
                                            {product.stock_quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {product.stock_quantity > 0 ? (
                                                <CheckCircle2 className="text-emerald-500" size={16} />
                                            ) : (
                                                <XCircle className="text-rose-500" size={16} />
                                            )}
                                            <span className={clsx(
                                                "text-sm font-medium",
                                                product.stock_quantity > 0 ? "text-emerald-400" : "text-rose-400"
                                            )}>
                                                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 rounded-lg transition-all cursor-pointer">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 rounded-lg transition-all cursor-pointer">
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-700/50 text-slate-400 rounded-lg transition-all cursor-pointer">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-6 border-t border-slate-800/50 flex items-center justify-between text-slate-400 text-sm">
                    <p>Showing {products.length} of {meta.total} results</p>
                    <div className="flex items-center gap-2">
                        <button 
                            className="px-4 py-2 bg-slate-800/50 disabled:opacity-50 hover:bg-slate-800 transition-all rounded-xl cursor-pointer"
                            onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={meta.page === 1}
                        >Previous</button>
                        <button 
                            className="px-4 py-2 bg-emerald-500 text-white disabled:opacity-50 disabled:bg-emerald-500/50 rounded-xl font-bold cursor-pointer hover:bg-emerald-400 transition-all"
                            onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={products.length < meta.limit}
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
