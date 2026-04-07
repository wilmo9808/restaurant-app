import { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
};

export const getMenu = async (token: string): Promise<Product[]> => {
    const response = await fetchWithAuth('/menu', { method: 'GET' }, token);
    return response.data;
};

export const getProductsByCategory = async (token: string, category: string): Promise<Product[]> => {
    const response = await fetchWithAuth(`/menu?category=${category}`, { method: 'GET' }, token);
    return response.data;
};

export const getProductById = async (token: string, id: string): Promise<Product> => {
    const response = await fetchWithAuth(`/menu/${id}`, { method: 'GET' }, token);
    return response.data;
};