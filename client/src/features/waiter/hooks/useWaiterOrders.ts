import { useOrders } from '../../../hooks/useOrders';
import { useOrderStore } from '../../../store/orderStore';
import { Order } from '../../../types/order';

export const useWaiterOrders = () => {
    const { orders, isLoading, createOrder, isCreating } = useOrders();
    const { currentOrder, clearCurrentOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity } = useOrderStore();

    const getOrdersByTable = (tableNumber: number): Order[] => {
        return orders.filter(order => order.tableNumber === tableNumber);
    };

    const getActiveOrders = (): Order[] => {
        return orders.filter(order => order.status !== 'COMPLETED');
    };

    const getCompletedOrders = (): Order[] => {
        return orders.filter(order => order.status === 'COMPLETED');
    };

    return {
        orders,
        isLoading,
        currentOrder,
        clearCurrentOrder,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        createOrder,
        isCreating,
        getOrdersByTable,
        getActiveOrders,
        getCompletedOrders,
    };
};