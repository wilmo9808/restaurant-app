"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderEvents = void 0;
const events_1 = require("../events");
const rooms_1 = require("../rooms");
const handleOrderEvents = (io, socket) => {
    socket.on(events_1.SOCKET_EVENTS.UPDATE_ORDER_STATUS, async (data) => {
        console.log(`Actualizando estado de orden ${data.orderId} a ${data.status}`);
        io.to(rooms_1.ROOMS.KITCHEN).emit(events_1.SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        io.to(rooms_1.ROOMS.CASHIER).emit(events_1.SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
    });
    socket.on(events_1.SOCKET_EVENTS.ORDER_READY, (orderId) => {
        console.log(`Orden ${orderId} lista para servir`);
        io.to(rooms_1.ROOMS.CASHIER).emit(events_1.SOCKET_EVENTS.ORDER_COMPLETED, orderId);
    });
};
exports.handleOrderEvents = handleOrderEvents;
