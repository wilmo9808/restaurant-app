import { useEffect, useState, useRef } from 'react';
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
        if (!token) {
            if (socketRef.current) {
                disconnectSocket();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // Si ya hay un socket conectado, no crear otro
        if (socketRef.current && socketRef.current.connected) {
            return;
        }

        const socketInstance = connectSocket(token);
        socketRef.current = socketInstance;

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
            if (socketRef.current) {
                socketRef.current.off('connect');
                socketRef.current.off('disconnect');
                socketRef.current.off(SOCKET_EVENTS.NEW_ORDER);
                socketRef.current.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED);
                disconnectSocket();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [token, user?.role]); // Solo depende de token y role, no de user completo

    const emit = (event: string, data: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        }
    };

    return { socket: socketRef.current, isConnected, emit };
};