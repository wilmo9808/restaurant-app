import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});

setupSocket(io);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📡 WebSocket disponible en ws://0.0.0.0:${PORT}`);
});