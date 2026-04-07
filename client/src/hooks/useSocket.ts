import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket, SOCKET_EVENTS } from '../config/socket';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { Order } from '../types/order';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const { token, user } = useAuthStore();
    const { addNewOrder, updateOrderStatus } = useOrderStore();

    useEffect(() => {
        if (!token) {
            if (socket) {
                disconnectSocket();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const socketInstance = connectSocket(token);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Socket conectado');
            setIsConnected(true);

            if (user?.role === 'CHEF') {
                socketInstance.emit(SOCKET_EVENTS.JOIN_KITCHEN);
            }
            if (user?.role === 'CASHIER') {
                socketInstance.emit(SOCKET_EVENTS.JOIN_CASHIER);
            }
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket desconectado');
            setIsConnected(false);
        });

        socketInstance.on(SOCKET_EVENTS.NEW_ORDER, (order: Order) => {
            addNewOrder(order);
        });

        socketInstance.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, (data: { orderId: string; status: string }) => {
            updateOrderStatus(data.orderId, data.status as any);
        });

        return () => {
            socketInstance.off('connect');
            socketInstance.off('disconnect');
            socketInstance.off(SOCKET_EVENTS.NEW_ORDER);
            socketInstance.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED);
            disconnectSocket();
            setSocket(null);
            setIsConnected(false);
        };
    }, [token, user]);

    const emit = (event: string, data: any) => {
        if (socket && isConnected) {
            socket.emit(event, data);
        }
    };

    return { socket, isConnected, emit };
};