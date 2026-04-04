import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';
import { ROOMS } from '../rooms';

export const handleOrderEvents = (io: Server, socket: Socket): void => {
    socket.on(SOCKET_EVENTS.UPDATE_ORDER_STATUS, async (data: { orderId: string; status: string }) => {
        console.log(`Actualizando estado de orden ${data.orderId} a ${data.status}`);

        io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        io.to(ROOMS.CASHIER).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
    });

    socket.on(SOCKET_EVENTS.ORDER_READY, (orderId: string) => {
        console.log(`Orden ${orderId} lista para servir`);

        io.to(ROOMS.CASHIER).emit(SOCKET_EVENTS.ORDER_COMPLETED, orderId);
    });
};