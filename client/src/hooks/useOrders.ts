import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { getOrders, updateOrderStatus as updateOrderStatusService, createOrder as createOrderService } from '../services/orderService';
import { OrderInput, Order } from '../types/order';
import { useSocket } from './useSocket';

export const useOrders = (status?: string) => {
    const { token } = useAuthStore();
    const { setActiveOrders, setKitchenOrders, setCashierOrders, updateOrderStatus: updateStoreStatus, addNewOrder } = useOrderStore();
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['orders', status],
        queryFn: () => getOrders(token!, status),
        enabled: !!token,
    });

    // Suscripción a eventos WebSocket para pedidos
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewOrder = (order: Order) => {
            console.log('📦 Nuevo pedido recibido en useOrders:', order.id.slice(-6));
            addNewOrder(order);
            refetch(); // Refrescar para asegurar consistencia
        };

        const handleOrderUpdated = (order: Order) => {
            console.log('🔄 Pedido actualizado en useOrders:', order.id.slice(-6), order.status);
            updateStoreStatus(order.id, order.status);
            refetch();
        };

        socket.on('new-order', handleNewOrder);
        socket.on('order-updated', handleOrderUpdated);

        return () => {
            socket.off('new-order', handleNewOrder);
            socket.off('order-updated', handleOrderUpdated);
        };
    }, [socket, isConnected, addNewOrder, updateStoreStatus, refetch]);

    useEffect(() => {
        if (data) {
            setActiveOrders(data);
            if (status === 'PENDING' || status === 'IN_PROGRESS') {
                setKitchenOrders(data);
            }
            if (status === 'READY') {
                setCashierOrders(data);
            }
        }
    }, [data, status, setActiveOrders, setKitchenOrders, setCashierOrders]);

    const createOrderMutation = useMutation({
        mutationFn: (order: OrderInput) => createOrderService(token!, order),
        onSuccess: (newOrder: Order) => {
            addNewOrder(newOrder);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatusService(token!, id, status),
        onSuccess: (updatedOrder: Order) => {
            updateStoreStatus(updatedOrder.id, updatedOrder.status);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        orders: data || [],
        isLoading,
        error,
        refetch,
        createOrder: createOrderMutation.mutate,
        isCreating: createOrderMutation.isPending,
        updateStatus: updateStatusMutation.mutate,
        isUpdating: updateStatusMutation.isPending,
    };
};