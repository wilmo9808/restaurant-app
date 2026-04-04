"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKitchenEvents = void 0;
const events_1 = require("../events");
const handleKitchenEvents = (io, socket) => {
    socket.on(events_1.SOCKET_EVENTS.JOIN_KITCHEN, () => {
        console.log(`Socket ${socket.id} unido a cocina`);
    });
    socket.on(events_1.SOCKET_EVENTS.JOIN_CASHIER, () => {
        console.log(`Socket ${socket.id} unido a caja`);
    });
};
exports.handleKitchenEvents = handleKitchenEvents;
