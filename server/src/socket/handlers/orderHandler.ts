import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';
import { ROOMS } from '../rooms';

export const handleOrderEvents = (io: Server, socket: Socket): void => {
    socket.on(SOCKET_EVENTS.UPDATE_ORDER_STATUS, async (data: { orderId: string; status: string }) => {
        console.log(`🛠️ [SOCKET HANDLER] Recibido evento UPDATE_ORDER_STATUS de ${socket.id}. Orden ${data.orderId.slice(-6)} -> ${data.status}`);

        io.to(ROOMS.KITCHEN).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        io.to(ROOMS.CASHIER).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, data);
        console.log(`📣 [SOCKET HANDLER] Re-emitido ORDER_STATUS_CHANGED a salas KITCHEN y CASHIER`);
    });

    socket.on(SOCKET_EVENTS.ORDER_READY, (orderId: string) => {
        console.log(`🛠️ [SOCKET HANDLER] Recibido evento ORDER_READY para orden ${orderId.slice(-6)}`);

        io.to(ROOMS.CASHIER).emit(SOCKET_EVENTS.ORDER_COMPLETED, orderId);
        console.log(`📣 [SOCKET HANDLER] Emitido ORDER_COMPLETED a sala CASHIER`);
    });
};