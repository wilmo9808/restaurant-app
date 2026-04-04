import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});

setupSocket(io);

server.listen(PORT, () => {
    console.log(`[INFO] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[INFO] WebSocket disponible en ws://localhost:${PORT}`);
});