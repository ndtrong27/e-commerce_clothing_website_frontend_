import { api } from './api';

export interface User {
    id: string;
    email: string;
    full_name?: string;
    roles?: string[];
    avatar_url?: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export const login = async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
};

export const register = async (userData: any): Promise<any> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('access_token');
};

export const refreshToken = async (): Promise<string> => {
    const response = await api.post('/auth/refresh');
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
};

export const getMe = async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
};
