import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket, SOCKET_EVENTS } from '../config/socket';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { Order } from '../types/order';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const { token, user } = useAuthStore();
    const { addNewOrder, updateOrderStatus } = useOrderStore();

    useEffect(() => {
        if (!token) return;

        const socket = connectSocket(token);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket conectado');
            setIsConnected(true);

            if (user?.role === 'CHEF') {
                socket.emit(SOCKET_EVENTS.JOIN_KITCHEN);
            }
            if (user?.role === 'CASHIER') {
                socket.emit(SOCKET_EVENTS.JOIN_CASHIER);
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado');
            setIsConnected(false);
        });

        socket.on(SOCKET_EVENTS.NEW_ORDER, (order: Order) => {
            addNewOrder(order);
        });

        socket.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, (data: { orderId: string; status: string }) => {
            updateOrderStatus(data.orderId, data.status as any);
        });

        return () => {
            disconnectSocket();
        };
    }, [token, user]);

    const emit = (event: string, data: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        }
    };

    return { isConnected, emit };
};