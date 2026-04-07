"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveAllRooms = exports.joinCashierRoom = exports.joinKitchenRoom = exports.ROOMS = void 0;
exports.ROOMS = {
    KITCHEN: 'kitchen',
    CASHIER: 'cashier',
};
const joinKitchenRoom = (socket) => {
    socket.join(exports.ROOMS.KITCHEN);
    console.log(`Socket ${socket.id} joined kitchen room`);
};
exports.joinKitchenRoom = joinKitchenRoom;
const joinCashierRoom = (socket) => {
    socket.join(exports.ROOMS.CASHIER);
    console.log(`Socket ${socket.id} joined cashier room`);
};
exports.joinCashierRoom = joinCashierRoom;
const leaveAllRooms = (socket) => {
    socket.leave(exports.ROOMS.KITCHEN);
    socket.leave(exports.ROOMS.CASHIER);
    console.log(`Socket ${socket.id} left all rooms`);
};
exports.leaveAllRooms = leaveAllRooms;
