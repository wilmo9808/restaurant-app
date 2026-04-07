import { Order, OrderInput, DailyReport, TotalsData } from '../types/order';

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

export const createOrder = async (token: string, order: OrderInput): Promise<Order> => {
    const response = await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
    }, token);
    return response.data;
};

export const getOrders = async (token: string, status?: string): Promise<Order[]> => {
    const endpoint = status ? `/orders?status=${status}` : '/orders';
    const response = await fetchWithAuth(endpoint, { method: 'GET' }, token);
    return response.data;
};

export const getOrderById = async (token: string, id: string): Promise<Order> => {
    const response = await fetchWithAuth(`/orders/${id}`, { method: 'GET' }, token);
    return response.data;
};

export const updateOrderStatus = async (token: string, id: string, status: string): Promise<Order> => {
    const response = await fetchWithAuth(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }, token);
    return response.data;
};

export const getDailyReport = async (token: string, date?: string): Promise<DailyReport> => {
    const endpoint = date ? `/reports/daily?date=${date}` : '/reports/daily';
    const response = await fetchWithAuth(endpoint, { method: 'GET' }, token);
    return response.data;
};

export const getTotals = async (token: string): Promise<TotalsData> => {
    const response = await fetchWithAuth('/reports/totals', { method: 'GET' }, token);
    return response.data;
};