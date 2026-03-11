"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    PlusCircle,
    Package
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Package, label: 'Products', href: '/dashboard/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
    { icon: Users, label: 'Users', href: '/dashboard/users' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-emerald-500/30">
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 cursor-pointer active:scale-95 transition-all"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex">
                {/* Sidebar - Liquid Glass Style */}
                <aside className={twMerge(
                    "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-500 ease-out lg:relative lg:translate-x-0 border-r border-slate-800/50",
                    "bg-[#0F172A]/80 backdrop-blur-xl",
                    !isSidebarOpen && "-translate-x-full"
                )}>
                    <div className="flex flex-col h-full p-6">
                        <div className="flex items-center gap-3 mb-12 px-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <ShoppingBag className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                                StyleStore <span className="text-emerald-500">Pro</span>
                            </span>
                        </div>

                        <nav className="flex-1 space-y-1.5">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={twMerge(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                        )}
                                    >
                                        <item.icon size={20} className={isActive ? "text-emerald-400" : "group-hover:text-emerald-400 transition-colors"} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="pt-6 mt-6 border-t border-slate-800/50">
                            <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group cursor-pointer">
                                <LogOut size={20} className="group-hover:text-rose-400" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Backdrop for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 lg:p-8 p-4 min-w-0 overflow-x-hidden">
                    {/* Dashboard Header */}
                    <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 tracking-tight text-white">Dashboard</h1>
                            <p className="text-slate-400 text-sm font-medium">Monitoring your store's performance & sales.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer active:scale-95 shadow-lg">
                                View Site
                            </button>
                            <button className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 flex items-center gap-2">
                                <PlusCircle size={18} />
                                New Product
                            </button>
                        </div>
                    </header>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
