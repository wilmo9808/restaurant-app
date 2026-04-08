import { Server as SocketServer, Socket } from 'socket.io';
import { setIO } from '../config/socket';
import { handleOrderEvents } from './handlers/orderHandler';
import { handleKitchenEvents } from './handlers/kitchenHandler';
import { joinKitchenRoom, joinCashierRoom, leaveAllRooms } from './rooms';

export const setupSocket = (io: SocketServer): void => {
    setIO(io);

    io.engine.on("connection_error", (err: any) => {
        console.log('🚨 [SERVER SOCKET] Fallo a nivel de motor (Handshake / Protocolo):', {
            url: err.req?.url,
            code: err.code,
            message: err.message,
            context: err.context
        });
    });

    io.on('connection', (socket: Socket) => {
        const user = (socket as any).user;
        console.log(`Usuario conectado [${user?.role}]: ${socket.id}`);

        socket.on('join-kitchen', () => {
            if (user?.role === 'SUPER_ADMIN' || user?.role === 'CHEF') {
                joinKitchenRoom(socket);
            }
        });

        socket.on('join-cashier', () => {
            if (user?.role === 'SUPER_ADMIN' || user?.role === 'CASHIER') {
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