import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

export const setIO = (socketIO: SocketServer) => {
    io = socketIO;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io no inicializado');
    }
    return io;
};

export const SOCKET_EVENTS = {
    NEW_ORDER: 'new-order',
    ORDER_UPDATED: 'order-updated',
    ORDER_STATUS_CHANGED: 'order-status-changed',
    ORDER_COMPLETED: 'order-completed',
    MENU_UPDATED: 'menu-updated',
    TABLES_UPDATED: 'tables-updated',
    JOIN_KITCHEN: 'join-kitchen',
    JOIN_CASHIER: 'join-cashier',
    UPDATE_ORDER_STATUS: 'update-order-status',
    ORDER_READY: 'order-ready',
} as const;