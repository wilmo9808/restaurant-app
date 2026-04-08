import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket';
import { verifyToken } from './utils/jwt';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer(app);

const io = new Server(server, {
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
        const decoded = verifyToken(token);
        (socket as any).user = decoded;
        console.log('✅ WebSocket autenticado:', decoded.email, 'Role:', decoded.role);
        next();
    } catch (error) {
        console.log('❌ WebSocket: Invalid token');
        next(new Error('Authentication error'));
    }
});

setupSocket(io);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📡 WebSocket disponible en ws://0.0.0.0:${PORT}`);
});