import { get, post, patch } from './api';
import { Order, OrderInput, DailyReport, TotalsData } from '../types/order';

export const createOrder = async (token: string, order: OrderInput): Promise<Order> => {
    const response = await post<{ success: boolean; data: Order }>('/orders', order, token);
    return response.data;
};

export const getOrders = async (token: string, status?: string): Promise<Order[]> => {
    const endpoint = status ? `/orders?status=${status}` : '/orders';
    const response = await get<{ success: boolean; data: Order[] }>(endpoint, token);
    return response.data;
};

export const getOrderById = async (token: string, id: string): Promise<Order> => {
    const response = await get<{ success: boolean; data: Order }>(`/orders/${id}`, token);
    return response.data;
};

export const updateOrderStatus = async (token: string, id: string, status: string): Promise<Order> => {
    const response = await patch<{ success: boolean; data: Order }>(`/orders/${id}`, { status }, token);
    return response.data;
};

export const getDailyReport = async (token: string, date?: string): Promise<DailyReport> => {
    const endpoint = date ? `/reports/daily?date=${date}` : '/reports/daily';
    const response = await get<{ success: boolean; data: DailyReport }>(endpoint, token);
    return response.data;
};

export const getTotals = async (token: string): Promise<TotalsData> => {
    const response = await get<{ success: boolean; data: TotalsData }>('/reports/totals', token);
    return response.data;
};