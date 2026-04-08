"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = void 0;
exports.SOCKET_EVENTS = {
    // Eventos del servidor → cliente
    NEW_ORDER: 'new-order',
    ORDER_UPDATED: 'order-updated',
    ORDER_STATUS_CHANGED: 'order-status-changed',
    ORDER_COMPLETED: 'order-completed',
    MENU_UPDATED: 'menu-updated',
    TABLES_UPDATED: 'tables-updated',
    // Eventos del cliente → servidor
    JOIN_KITCHEN: 'join-kitchen',
    JOIN_CASHIER: 'join-cashier',
    UPDATE_ORDER_STATUS: 'update-order-status',
    ORDER_READY: 'order-ready',
};
