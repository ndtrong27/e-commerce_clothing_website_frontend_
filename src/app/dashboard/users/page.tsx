"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    UserPlus, 
    Shield, 
    ShieldCheck, 
    MoreHorizontal, 
    Mail,
    Calendar,
    User,
    UserCheck,
    Lock,
    Unlock,
    Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchAdminUsers } from '@/services/api';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, [searchTerm, meta.page]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchAdminUsers({ 
                page: meta.page, 
                limit: meta.limit 
            });
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: meta.total.toString(), icon: Users, color: 'blue' },
                    { label: 'Admin Users', value: users.filter(u => u.roles.includes('admin')).length.toString(), icon: ShieldCheck, color: 'emerald' },
                    { label: 'Customer Users', value: users.filter(u => u.roles.includes('customer')).length.toString(), icon: User, color: 'slate' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl flex items-center gap-5 hover:border-blue-500/30 transition-all group shadow-xl">
                        <div className={twMerge(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                            stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10" :
                            stat.color === 'blue' ? "bg-blue-500/10 text-blue-400 shadow-blue-500/10" :
                            "bg-rose-500/10 text-rose-400 shadow-rose-500/10"
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

            {/* Users Table Card */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/20">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or ID..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/50 transition-all cursor-pointer font-medium text-sm">
                            <Shield size={18} />
                            All Roles
                        </button>
                        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2">
                            <UserPlus size={18} />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/30">
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : users.map((user) => {
                                const mainRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'customer';
                                const displayRole = mainRole.charAt(0).toUpperCase() + mainRole.slice(1);
                                
                                return (
                                    <tr key={user.id} className="hover:bg-blue-500/5 transition-all group cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700/50 overflow-hidden group-hover:border-blue-500/40 transition-all flex items-center justify-center text-slate-400">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-slate-100 font-bold group-hover:text-blue-400 transition-colors">{user.full_name || 'Anonymous User'}</div>
                                                    <div className="text-slate-500 text-xs font-mono">{user.id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Mail size={14} className="text-slate-500" />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={twMerge(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border",
                                                mainRole === 'admin' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5' :
                                                'text-slate-400 bg-slate-800/50 border-slate-700/50'
                                            )}>
                                                {mainRole === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                                                {displayRole}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm font-mono tracking-tight">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={twMerge(
                                                    "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                                                    "bg-emerald-500 animate-pulse" 
                                                )} />
                                                <span className={clsx(
                                                    "text-sm font-medium",
                                                    "text-emerald-400"
                                                )}>
                                                    Active
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-blue-500/10 hover:text-blue-400 text-slate-400 rounded-lg transition-all cursor-pointer">
                                                    <UserCheck size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 rounded-lg transition-all cursor-pointer">
                                                    <Lock size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all cursor-pointer">
                                                    <Trash2 size={18} />
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
                    <p>Showing {users.length} of {meta.total} users</p>
                    <div className="flex items-center gap-2">
                        <button 
                            className="px-4 py-2 bg-slate-800/50 disabled:opacity-50 hover:bg-slate-800 text-slate-300 transition-all rounded-xl cursor-pointer"
                            onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={meta.page === 1}
                        >Previous</button>
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white disabled:opacity-50 disabled:bg-blue-500/50 rounded-xl font-bold cursor-pointer hover:bg-blue-400 transition-all"
                            onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={users.length < meta.limit}
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fixed missing import
import { Users } from 'lucide-react';
import { ShoppingBag } from 'lucide-react'; // Placeholder if needed elsewhere
