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
            console.log('🔌 No hay token, socket no conectado');
            if (socketRef.current) {
                disconnectSocket();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // Si ya hay un socket conectado, no crear otro
        if (socketRef.current && socketRef.current.connected) {
            console.log('⚠️ Socket ya conectado, reutilizando...');
            return;
        }

        console.log('🔄 Conectando socket con token...');
        const socketInstance = connectSocket(token);
        socketRef.current = socketInstance;

        socketInstance.on('connect', () => {
            console.log('✅ Socket conectado - ID:', socketInstance.id);
            setIsConnected(true);

            if (user?.role === 'CHEF') {
                console.log('👨‍🍳 Uniéndose a sala de cocina');
                socketInstance.emit(SOCKET_EVENTS.JOIN_KITCHEN);
            }
            if (user?.role === 'CASHIER') {
                console.log('💰 Uniéndose a sala de caja');
                socketInstance.emit(SOCKET_EVENTS.JOIN_CASHIER);
            }
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('❌ Socket desconectado - Razón:', reason);
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('🚫 [CLIENT SOCKET] Error de conexión WebSocket completo:', error);
            console.error('🚫 [CLIENT SOCKET] Detalle del mensaje:', error.message);
            if (socketInstance.io.engine) {
                console.error('🚫 [CLIENT SOCKET] Transporte actual intentado:', socketInstance.io.engine.transport.name);
            }
        });

        socketInstance.on(SOCKET_EVENTS.NEW_ORDER, (order: Order) => {
            console.log('📦 Nuevo pedido recibido:', order.id.slice(-6));
            addNewOrder(order);
        });

        socketInstance.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, (data: { orderId: string; status: string }) => {
            console.log('🔄 Estado de pedido cambiado:', data.orderId.slice(-6), '→', data.status);
            updateOrderStatus(data.orderId, data.status as any);
        });

        // Evento para depuración de mesas
        socketInstance.on('tables-updated', (data) => {
            console.log('📡 Evento tables-updated RECIBIDO en frontend:', data);
        });

        return () => {
            console.log('🧹 Limpiando conexión socket');
            if (socketRef.current) {
                socketRef.current.off('connect');
                socketRef.current.off('disconnect');
                socketRef.current.off('connect_error');
                socketRef.current.off(SOCKET_EVENTS.NEW_ORDER);
                socketRef.current.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED);
                socketRef.current.off('tables-updated');
                disconnectSocket();
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [token, user?.role]);

    const emit = (event: string, data: any) => {
        if (socketRef.current && isConnected) {
            console.log(`📤 Emitiendo evento: ${event}`, data);
            socketRef.current.emit(event, data);
        } else {
            console.warn(`⚠️ No se pudo emitir ${event}: socket no conectado`);
        }
    };

    return { socket: socketRef.current, isConnected, emit };
};