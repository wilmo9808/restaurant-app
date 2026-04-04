import { create } from 'zustand';
import { Order, OrderItemInput, OrderStatus } from '../types/order';

interface CurrentOrder {
    tableNumber: number;
    items: OrderItemInput[];
    total: number;
    notes?: string;
}

interface OrderState {
    currentOrder: CurrentOrder | null;
    activeOrders: Order[];
    kitchenOrders: Order[];
    cashierOrders: Order[];
    setCurrentOrder: (order: CurrentOrder | null) => void;
    addItemToOrder: (item: OrderItemInput) => void;
    removeItemFromOrder: (productId: string) => void;
    updateItemQuantity: (productId: string, quantity: number) => void;
    clearCurrentOrder: () => void;
    setActiveOrders: (orders: Order[]) => void;
    setKitchenOrders: (orders: Order[]) => void;
    setCashierOrders: (orders: Order[]) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addNewOrder: (order: Order) => void;
    setOrderNotes: (notes: string) => void;
}

// Función para calcular el total de un item incluyendo toppings
const calculateItemTotal = (item: OrderItemInput): number => {
    const baseTotal = item.price * item.quantity;
    const toppingsTotal = (item.modifications || []).reduce((sum, topping) => sum + topping.price, 0) * item.quantity;
    return baseTotal + toppingsTotal;
};

// Función para calcular el total del pedido
const calculateOrderTotal = (items: OrderItemInput[]): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

export const useOrderStore = create<OrderState>((set, get) => ({
    currentOrder: null,
    activeOrders: [],
    kitchenOrders: [],
    cashierOrders: [],

    setCurrentOrder: (order) => set({ currentOrder: order }),

    addItemToOrder: (item) => {
        const { currentOrder } = get();
        if (!currentOrder) {
            set({
                currentOrder: {
                    tableNumber: 0,
                    items: [item],
                    total: calculateItemTotal(item),
                    notes: '',
                },
            });
            return;
        }

        const existingItemIndex = currentOrder.items.findIndex(
            (i) => i.productId === item.productId
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
            updatedItems = [...currentOrder.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            // Combinar toppings
            if (item.modifications && updatedItems[existingItemIndex].modifications) {
                updatedItems[existingItemIndex].modifications = [
                    ...(updatedItems[existingItemIndex].modifications || []),
                    ...(item.modifications || [])
                ];
            }
        } else {
            updatedItems = [...currentOrder.items, item];
        }

        const newTotal = calculateOrderTotal(updatedItems);

        set({
            currentOrder: {
                ...currentOrder,
                items: updatedItems,
                total: newTotal,
            },
        });
    },

    removeItemFromOrder: (productId) => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        const updatedItems = currentOrder.items.filter((i) => i.productId !== productId);
        const newTotal = calculateOrderTotal(updatedItems);

        set({
            currentOrder: {
                ...currentOrder,
                items: updatedItems,
                total: newTotal,
            },
        });
    },

    updateItemQuantity: (productId, quantity) => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        const updatedItems = currentOrder.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
        );

        const newTotal = calculateOrderTotal(updatedItems);

        set({
            currentOrder: {
                ...currentOrder,
                items: updatedItems,
                total: newTotal,
            },
        });
    },

    clearCurrentOrder: () => set({ currentOrder: null }),

    setActiveOrders: (orders) => set({ activeOrders: orders }),

    setKitchenOrders: (orders) => set({ kitchenOrders: orders }),

    setCashierOrders: (orders) => set({ cashierOrders: orders }),

    updateOrderStatus: (orderId, status) => {
        const updateOrders = (orders: Order[]) =>
            orders.map((order) =>
                order.id === orderId ? { ...order, status } : order
            );

        set((state) => ({
            activeOrders: updateOrders(state.activeOrders),
            kitchenOrders: updateOrders(state.kitchenOrders),
            cashierOrders: updateOrders(state.cashierOrders),
        }));
    },

    addNewOrder: (order) => {
        set((state) => ({
            activeOrders: [order, ...state.activeOrders],
            kitchenOrders: [order, ...state.kitchenOrders],
            cashierOrders: [order, ...state.cashierOrders],
        }));
    },

    setOrderNotes: (notes) => {
        const { currentOrder } = get();
        if (currentOrder) {
            set({
                currentOrder: {
                    ...currentOrder,
                    notes,
                },
            });
        }
    },
}));