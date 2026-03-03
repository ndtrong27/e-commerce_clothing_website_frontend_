'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getMe, login as authLogin, logout as authLogout, AuthResponse } from '../services/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<AuthResponse>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: any) => {
        const response = await authLogin(credentials);
        setUser(response.user);
        return response;
    };

    const logout = async () => {
        await authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
