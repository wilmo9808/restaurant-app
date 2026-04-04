import { useOrders } from '../../../hooks/useOrders';
import { useSocket } from '../../../hooks/useSocket';
import { useUIStore } from '../../../store/uiStore';
import { Order } from '../../../types/order';

export const useKitchenOrders = () => {
    const { orders, isLoading, updateStatus, isUpdating } = useOrders();
    const { emit } = useSocket();
    const { showToast } = useUIStore();

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const inProgressOrders = orders.filter(o => o.status === 'IN_PROGRESS');
    const readyOrders = orders.filter(o => o.status === 'READY');

    const startOrder = (orderId: string) => {
        updateStatus({ id: orderId, status: 'IN_PROGRESS' });
        showToast('Pedido iniciado', 'info');
    };

    const completeOrder = (orderId: string) => {
        updateStatus({ id: orderId, status: 'READY' });
        emit('order-ready', orderId);
        showToast('Pedido listo para servir', 'success');
    };

    const markAsCompleted = (orderId: string) => {
        updateStatus({ id: orderId, status: 'COMPLETED' });
        showToast('Pedido completado', 'success');
    };

    const getOrdersByStatus = (status: string): Order[] => {
        return orders.filter(o => o.status === status);
    };

    return {
        orders,
        isLoading,
        isUpdating,
        pendingOrders,
        inProgressOrders,
        readyOrders,
        startOrder,
        completeOrder,
        markAsCompleted,
        getOrdersByStatus,
    };
};