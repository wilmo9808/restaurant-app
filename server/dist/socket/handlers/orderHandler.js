"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderEvents = void 0;
const events_1 = require("../events");
const rooms_1 = require("../rooms");
const handleOrderEvents = (io, socket) => {
    socket.on(events_1.SOCKET_EVENTS.UPDATE_ORDER_STATUS, async (data) => {
        console.log(`🛠️ [SOCKET HANDLER] Recibido evento UPDATE_ORDER_STATUS de ${socket.id}. Orden ${data.orderId.slice(-6)} -> ${data.status}`);
        io.to(rooms_1.ROOMS.KITCHEN).emit(events_1.SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        io.to(rooms_1.ROOMS.CASHIER).emit(events_1.SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        console.log(`📣 [SOCKET HANDLER] Re-emitido ORDER_STATUS_CHANGED a salas KITCHEN y CASHIER`);
    });
    socket.on(events_1.SOCKET_EVENTS.ORDER_READY, (orderId) => {
        console.log(`🛠️ [SOCKET HANDLER] Recibido evento ORDER_READY para orden ${orderId.slice(-6)}`);
        io.to(rooms_1.ROOMS.CASHIER).emit(events_1.SOCKET_EVENTS.ORDER_COMPLETED, orderId);
        console.log(`📣 [SOCKET HANDLER] Emitido ORDER_COMPLETED a sala CASHIER`);
    });
};
exports.handleOrderEvents = handleOrderEvents;
