"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const tableRoutes_1 = __importDefault(require("./routes/tableRoutes"));
const toppingRoutes_1 = __importDefault(require("./routes/toppingRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// Seguridad en cabeceras HTTP
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Límite de peticiones global (200 reqs / 15 mins)
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.' }
});
app.use(globalLimiter);
// Configurar CORS para múltiples orígenes
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://ordenaya-web.onrender.com', // Frontend en producción
    'https://ordenaya-api.onrender.com', // Backend en producción
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log(`🚫 CORS bloqueado: ${origin}`);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir archivos estáticos (solo en desarrollo, en producción usar Cloudinary)
if (process.env.NODE_ENV !== 'production') {
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
}
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor funcionando' });
});
// Rutas de la API
app.use('/api/public', publicRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/menu', menuRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/tables', tableRoutes_1.default);
app.use('/api/toppings', toppingRoutes_1.default);
// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.url}` });
});
exports.default = app;
