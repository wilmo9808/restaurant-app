import { get } from './api';
import { Product } from '../types/product';

export const getMenu = async (token: string): Promise<Product[]> => {
    const response = await get<{ success: boolean; data: Product[] }>('/menu', token);
    return response.data;
};

export const getProductsByCategory = async (token: string, category: string): Promise<Product[]> => {
    const response = await get<{ success: boolean; data: Product[] }>(`/menu?category=${category}`, token);
    return response.data;
};

export const getProductById = async (token: string, id: string): Promise<Product> => {
    const response = await get<{ success: boolean; data: Product }>(`/menu/${id}`, token);
    return response.data;
};