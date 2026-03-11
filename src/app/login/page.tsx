'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login({ email, password });
            
            if (response?.user?.roles?.includes('admin')) {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cta-brand/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary-brand/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl relative z-10 border border-glass-border">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading mb-2 text-foreground">Welcome Back</h1>
                    <p className="text-secondary-brand font-body text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-body">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-secondary-brand uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cta-brand transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cta-brand/20 focus:border-cta-brand outline-none transition-all font-body"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-semibold text-secondary-brand uppercase tracking-wider">Password</label>
                            <Link href="#" className="text-xs text-cta-brand hover:underline font-medium">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cta-brand transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-cta-brand/20 focus:border-cta-brand outline-none transition-all font-body"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary-brand text-white rounded-2xl font-body font-semibold flex items-center justify-center gap-2 hover:bg-secondary-brand active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/10 group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center font-body">
                    <p className="text-sm text-secondary-brand">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-cta-brand font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
