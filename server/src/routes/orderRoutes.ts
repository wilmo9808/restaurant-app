import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createNewOrder, getOrders, getOrder, updateOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { isWaiter, isChefOrCashier, isChef, isCashier } from '../middleware/roleMiddleware';
import { validateOrder } from '../middleware/validationMiddleware';

const router = Router();

// Rate limiter para creación de pedidos (máximo 10 por minuto por IP)
const createOrderLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10,
    message: {
        success: false,
        message: 'Demasiados pedidos creados. Espera un momento antes de intentar de nuevo.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter general para consultas (máximo 60 por minuto por IP)
const generalOrderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: {
        success: false,
        message: 'Demasiadas solicitudes. Espera un momento.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', authMiddleware, isWaiter, createOrderLimiter, validateOrder, createNewOrder);
router.get('/', authMiddleware, isChefOrCashier, generalOrderLimiter, getOrders);
router.get('/:id', authMiddleware, generalOrderLimiter, getOrder);
router.patch('/:id', authMiddleware, isChefOrCashier, updateOrder);

export default router;