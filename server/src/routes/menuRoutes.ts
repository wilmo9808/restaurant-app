import { Router } from 'express';
import { getProducts, getProduct, addProduct } from '../controllers/menuController';
import { authMiddleware } from '../middleware/authMiddleware';
import { isWaiter } from '../middleware/roleMiddleware';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware, getProducts);
router.get('/:id', authMiddleware, getProduct);
router.post('/', authMiddleware, isWaiter, addProduct);

export default router;