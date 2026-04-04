import { OrderResponse, OrderStatus } from './order';

export interface ServerToClientEvents {
    'new-order': (order: OrderResponse) => void;
    'order-updated': (order: OrderResponse) => void;
    'order-status-changed': (orderId: string, status: OrderStatus) => void;
    'order-completed': (orderId: string) => void;
}

export interface ClientToServerEvents {
    'join-kitchen': () => void;
    'join-cashier': () => void;
    'update-order-status': (data: { orderId: string; status: OrderStatus }) => void;
    'order-ready': (orderId: string) => void;
}

export interface SocketData {
    userId: string;
    userRole: string;
}