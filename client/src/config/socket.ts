import io, { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        console.log('🔗 [CLIENT SOCKET] VITE_SOCKET_URL env:', import.meta.env.VITE_SOCKET_URL);
        console.log('🔗 [CLIENT SOCKET] Inicializando con URL:', SOCKET_URL);
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = (token: string): Socket => {
    const socketInstance = getSocket();

    socketInstance.auth = { token };
    socketInstance.connect();

    return socketInstance;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const SOCKET_EVENTS = {
    NEW_ORDER: 'new-order',
    ORDER_UPDATED: 'order-updated',
    ORDER_STATUS_CHANGED: 'order-status-changed',
    ORDER_COMPLETED: 'order-completed',
    JOIN_KITCHEN: 'join-kitchen',
    JOIN_CASHIER: 'join-cashier',
    UPDATE_ORDER_STATUS: 'update-order-status',
    ORDER_READY: 'order-ready',
} as const;