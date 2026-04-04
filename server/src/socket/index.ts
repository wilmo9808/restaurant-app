import { Server as SocketServer, Socket } from 'socket.io';
import { setIO } from '../config/socket';
import { handleOrderEvents } from './handlers/orderHandler';
import { handleKitchenEvents } from './handlers/kitchenHandler';
import { joinKitchenRoom, joinCashierRoom, leaveAllRooms } from './rooms';
import { verifyToken } from '../utils/jwt';

export const setupSocket = (io: SocketServer): void => {
    setIO(io);

    // Middleware de autenticación global para WebSockets
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Autenticación fallida: Token no proporcionado'));
        }
        try {
            const decoded = verifyToken(token);
            (socket as any).user = decoded; // Inyecta datos del usuario autenticado
            next();
        } catch (error) {
            return next(new Error('Autenticación fallida: Token inválido'));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log(`Usuario conectado [${(socket as any).user?.role}]: ${socket.id}`);

        socket.on('join-kitchen', () => {
            if ((socket as any).user?.role === 'SUPER_ADMIN' || (socket as any).user?.role === 'CHEF') {
                joinKitchenRoom(socket);
            }
        });

        socket.on('join-cashier', () => {
            if ((socket as any).user?.role === 'SUPER_ADMIN' || (socket as any).user?.role === 'CASHIER') {
                joinCashierRoom(socket);
            }
        });

        handleOrderEvents(io, socket);
        handleKitchenEvents(io, socket);

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
            leaveAllRooms(socket);
        });
    });
};