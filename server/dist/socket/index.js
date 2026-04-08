"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_1 = require("../config/socket");
const orderHandler_1 = require("./handlers/orderHandler");
const kitchenHandler_1 = require("./handlers/kitchenHandler");
const rooms_1 = require("./rooms");
const setupSocket = (io) => {
    (0, socket_1.setIO)(io);
    io.engine.on("connection_error", (err) => {
        console.log('🚨 [SERVER SOCKET] Fallo a nivel de motor (Handshake / Protocolo):', {
            url: err.req?.url,
            code: err.code,
            message: err.message,
            context: err.context
        });
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        console.log(`Usuario conectado [${user?.role}]: ${socket.id}`);
        socket.on('join-kitchen', () => {
            if (user?.role === 'SUPER_ADMIN' || user?.role === 'CHEF') {
                (0, rooms_1.joinKitchenRoom)(socket);
            }
        });
        socket.on('join-cashier', () => {
            if (user?.role === 'SUPER_ADMIN' || user?.role === 'CASHIER') {
                (0, rooms_1.joinCashierRoom)(socket);
            }
        });
        (0, orderHandler_1.handleOrderEvents)(io, socket);
        (0, kitchenHandler_1.handleKitchenEvents)(io, socket);
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
            (0, rooms_1.leaveAllRooms)(socket);
        });
    });
};
exports.setupSocket = setupSocket;
