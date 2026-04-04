import { OrderItem, OrderItemInput } from './OrderItem';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';

export interface Order {
    id: string;
    tableNumber: number;
    status: OrderStatus;
    total: number;
    userId: string;
    userName?: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderCreateInput {
    tableNumber: number;
    items: OrderItemInput[];
    total: number;
    userId: string;
}

export interface OrderUpdateInput {
    status?: OrderStatus;
    total?: number;
}

export interface OrderResponse {
    id: string;
    tableNumber: number;
    status: OrderStatus;
    total: number;
    userId: string;
    userName: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderFilterInput {
    status?: OrderStatus;
    tableNumber?: number;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
}