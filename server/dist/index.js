"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});
(0, socket_1.setupSocket)(io);
server.listen(PORT, () => {
    console.log(`[INFO] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[INFO] WebSocket disponible en ws://localhost:${PORT}`);
});
