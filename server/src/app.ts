import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import reportRoutes from './routes/reportRoutes';
import adminRoutes from './routes/adminRoutes';
import tableRoutes from './routes/tableRoutes';
import toppingRoutes from './routes/toppingRoutes';
import publicRoutes from './routes/publicRoutes';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

// Seguridad en cabeceras HTTP
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Permite cargar recursos desde dominios diferentes (ej. Frontend Vite)
}));

// Límite de peticiones global (200 reqs / 15 mins)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.' }
});
app.use(globalLimiter);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (imágenes de la carpeta uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor funcionando' });
});

// Rutas de la API
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/toppings', toppingRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.url}` });
});

export default app;