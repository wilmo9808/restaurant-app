export const SOCKET_EVENTS = {
    // Eventos del servidor → cliente
    NEW_ORDER: 'new-order',
    ORDER_UPDATED: 'order-updated',
    ORDER_STATUS_CHANGED: 'order-status-changed',
    ORDER_COMPLETED: 'order-completed',
    MENU_UPDATED: 'menu-updated',

    // Eventos del cliente → servidor
    JOIN_KITCHEN: 'join-kitchen',
    JOIN_CASHIER: 'join-cashier',
    UPDATE_ORDER_STATUS: 'update-order-status',
    ORDER_READY: 'order-ready',
} as const;

export type ServerToClientEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
export type ClientToServerEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];