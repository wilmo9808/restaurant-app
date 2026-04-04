"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = exports.getIO = exports.setIO = void 0;
let io = null;
const setIO = (socketIO) => {
    io = socketIO;
};
exports.setIO = setIO;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io no inicializado');
    }
    return io;
};
exports.getIO = getIO;
exports.SOCKET_EVENTS = {
    NEW_ORDER: 'new-order',
    ORDER_UPDATED: 'order-updated',
    ORDER_STATUS_CHANGED: 'order-status-changed',
    ORDER_COMPLETED: 'order-completed',
    MENU_UPDATED: 'menu-updated',
    JOIN_KITCHEN: 'join-kitchen',
    JOIN_CASHIER: 'join-cashier',
    UPDATE_ORDER_STATUS: 'update-order-status',
    ORDER_READY: 'order-ready',
};
