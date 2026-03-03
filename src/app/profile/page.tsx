'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Settings, Package, Heart, LogOut, ChevronRight, MapPin, Phone } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-body">
                <div className="w-8 h-8 border-4 border-cta-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    const menuItems = [
        { icon: Package, label: 'My Orders', description: 'Track and manage your purchases', color: 'bg-blue-500' },
        { icon: Heart, label: 'Wishlist', description: 'Items you have saved for later', color: 'bg-pink-500' },
        { icon: MapPin, label: 'Addresses', description: 'Manage your shipping locations', color: 'bg-green-500' },
        { icon: Phone, label: 'Contact Info', description: 'Phone numbers and emails', color: 'bg-purple-500' },
        { icon: Settings, label: 'Account Settings', description: 'Security and notification preferences', color: 'bg-gray-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 font-body">
            {/* Profile Header */}
            <div className="glass-card p-10 rounded-[2.5rem] border border-glass-border shadow-xl mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6">
                    <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <Settings className="w-6 h-6 text-secondary-brand" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cta-brand to-primary-brand p-1 shadow-lg shadow-cta-brand/20">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <User className="w-16 h-16 text-primary-brand" />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-heading font-bold text-foreground mb-1">{user.full_name || 'Member'}</h1>
                        <p className="text-secondary-brand mb-4">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {user.roles?.map(role => (
                                <span key={role} className="px-4 py-1.5 bg-primary-brand text-white text-[10px] uppercase tracking-widest font-bold rounded-full shadow-sm">
                                    {role}
                                </span>
                            ))}
                            <span className="px-4 py-1.5 bg-cta-brand/10 text-cta-brand text-[10px] uppercase tracking-widest font-bold rounded-full border border-cta-brand/20">
                                Premium Member
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="glass-card p-6 rounded-3xl border border-glass-border hover:border-cta-brand/30 hover:shadow-lg transition-all text-left flex items-center gap-6 group"
                    >
                        <div className={`p-4 rounded-2xl ${item.color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}>
                            <item.icon className={`w-6 h-6 text-opacity-100`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-foreground group-hover:text-cta-brand transition-colors">{item.label}</h3>
                            <p className="text-sm text-secondary-brand line-clamp-1">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-cta-brand transform group-hover:translate-x-1 transition-all" />
                    </button>
                ))}

                <button
                    onClick={() => logout()}
                    className="glass-card p-6 rounded-3xl border border-red-100 hover:bg-red-50 transition-all text-left flex items-center gap-6 group md:col-span-2"
                >
                    <div className="p-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-red-600 transition-colors">Sign Out</h3>
                        <p className="text-sm text-red-400">Securely exit your account session</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}
