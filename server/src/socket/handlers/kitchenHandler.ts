import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';

export const handleKitchenEvents = (io: Server, socket: Socket): void => {
    socket.on(SOCKET_EVENTS.JOIN_KITCHEN, () => {
        console.log(`Socket ${socket.id} unido a cocina`);
    });

    socket.on(SOCKET_EVENTS.JOIN_CASHIER, () => {
        console.log(`Socket ${socket.id} unido a caja`);
    });
};