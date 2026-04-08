"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const jwt_1 = require("./utils/jwt");
const PORT = parseInt(process.env.PORT || '3000', 10);
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'https://ordenaya-web.onrender.com',
            'http://localhost:5173'
        ],
        credentials: true,
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});
// Middleware de autenticación para WebSocket
io.use((socket, next) => {
    console.log('🕵️ [SERVER SOCKET] Intento de conexión desde origen:', socket.handshake.headers.origin);
    console.log('🕵️ [SERVER SOCKET] Detalles del handshake:', {
        url: socket.handshake.url,
        query: socket.handshake.query,
        headers: {
            origin: socket.handshake.headers.origin,
            referer: socket.handshake.headers.referer,
        }
    });
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log('❌ [SERVER SOCKET] WebSocket rechazado: No token provided');
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        socket.user = decoded;
        console.log('✅ WebSocket autenticado:', decoded.email, 'Role:', decoded.role);
        next();
    }
    catch (error) {
        console.log('❌ WebSocket: Invalid token');
        next(new Error('Authentication error'));
    }
});
(0, socket_1.setupSocket)(io);
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📡 WebSocket disponible en ws://0.0.0.0:${PORT}`);
});
