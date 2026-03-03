"use client";

import Link from 'next/link';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
    const cartItems = useCart((state) => state.items);
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-heading font-bold text-primary-brand tracking-tighter transition-all group-hover:text-cta-brand">StyleStore</span>
                        </Link>

                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link href="/shop" className="text-sm font-body border-transparent text-secondary-brand hover:text-primary-brand inline-flex items-center px-1 pt-1 border-b-2 transition-colors">
                                Shop
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link href="/profile" className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-cta-brand/10 flex items-center justify-center border border-cta-brand/20">
                                        <UserIcon className="h-4 w-4 text-cta-brand" />
                                    </div>
                                    <span className="text-sm font-body font-medium text-secondary-brand group-hover:text-primary-brand hidden md:block">
                                        {user.full_name || user.email}
                                    </span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-secondary-brand hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-body font-medium text-secondary-brand hover:text-primary-brand px-3 py-2 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-body font-medium bg-primary-brand text-white px-5 py-2.5 rounded-xl hover:bg-secondary-brand shadow-lg shadow-black/10 transition-all active:scale-95"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        <div className="h-8 w-px bg-gray-100 mx-2" />

                        <Link href="/cart" className="p-2 text-secondary-brand hover:text-primary-brand relative transition-colors group">
                            <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold leading-none text-white bg-cta-brand rounded-full border-2 border-white shadow-sm">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
