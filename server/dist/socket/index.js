"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_1 = require("../config/socket");
const orderHandler_1 = require("./handlers/orderHandler");
const kitchenHandler_1 = require("./handlers/kitchenHandler");
const rooms_1 = require("./rooms");
const jwt_1 = require("../utils/jwt");
const setupSocket = (io) => {
    (0, socket_1.setIO)(io);
    // Middleware de autenticación global para WebSockets
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Autenticación fallida: Token no proporcionado'));
        }
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            socket.user = decoded; // Inyecta datos del usuario autenticado
            next();
        }
        catch (error) {
            return next(new Error('Autenticación fallida: Token inválido'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`Usuario conectado [${socket.user?.role}]: ${socket.id}`);
        socket.on('join-kitchen', () => {
            if (socket.user?.role === 'SUPER_ADMIN' || socket.user?.role === 'CHEF') {
                (0, rooms_1.joinKitchenRoom)(socket);
            }
        });
        socket.on('join-cashier', () => {
            if (socket.user?.role === 'SUPER_ADMIN' || socket.user?.role === 'CASHIER') {
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
