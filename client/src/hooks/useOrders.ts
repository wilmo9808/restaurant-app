import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { getOrders, updateOrderStatus as updateOrderStatusService, createOrder as createOrderService } from '../services/orderService';
import { OrderInput, Order } from '../types/order';

export const useOrders = (status?: string) => {
    const { token } = useAuthStore();
    const { setActiveOrders, setKitchenOrders, setCashierOrders, updateOrderStatus: updateStoreStatus, addNewOrder } = useOrderStore();
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['orders', status],
        queryFn: () => getOrders(token!, status),
        enabled: !!token,
    });

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