import { Order, OrderStatus } from './order';

export interface ServerToClientEvents {
    'new-order': (order: Order) => void;
    'order-updated': (order: Order) => void;
    'order-status-changed': (data: { orderId: string; status: OrderStatus }) => void;
    'order-completed': (orderId: string) => void;
}

export interface ClientToServerEvents {
    'join-kitchen': () => void;
    'join-cashier': () => void;
    'update-order-status': (data: { orderId: string; status: OrderStatus }) => void;
    'order-ready': (orderId: string) => void;
}