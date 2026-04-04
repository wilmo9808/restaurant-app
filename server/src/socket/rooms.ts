import { Socket } from 'socket.io';

export const ROOMS = {
    KITCHEN: 'kitchen',
    CASHIER: 'cashier',
} as const;

export const joinKitchenRoom = (socket: Socket): void => {
    socket.join(ROOMS.KITCHEN);
    console.log(`Socket ${socket.id} joined kitchen room`);
};

export const joinCashierRoom = (socket: Socket): void => {
    socket.join(ROOMS.CASHIER);
    console.log(`Socket ${socket.id} joined cashier room`);
};

export const leaveAllRooms = (socket: Socket): void => {
    socket.leave(ROOMS.KITCHEN);
    socket.leave(ROOMS.CASHIER);
    console.log(`Socket ${socket.id} left all rooms`);
};