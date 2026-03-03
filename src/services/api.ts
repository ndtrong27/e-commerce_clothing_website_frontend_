import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Necessary for HttpOnly cookies
});

// Request interceptor: Attach access token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call refresh endpoint
                const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                const { access_token } = response.data;

                localStorage.setItem('access_token', access_token);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out and redirect
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

import { Product } from '../types';

interface ApiProduct extends Omit<Product, 'price'> {
    price: string;
}

export const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data.map((product: ApiProduct) => ({
        ...product,
        price: parseFloat(product.price)
    }));
};

export const fetchProductById = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    const data = response.data as ApiProduct;
    return {
        ...data,
        price: parseFloat(data.price)
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
