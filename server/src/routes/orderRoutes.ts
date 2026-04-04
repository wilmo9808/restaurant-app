import { Router } from 'express';
import { createNewOrder, getOrders, getOrder, updateOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';
import { isWaiter, isChefOrCashier, isChef, isCashier } from '../middleware/roleMiddleware';
import { validateOrder } from '../middleware/validationMiddleware';

const router = Router();

router.post('/', authMiddleware, isWaiter, validateOrder, createNewOrder);
router.get('/', authMiddleware, isChefOrCashier, getOrders);
router.get('/:id', authMiddleware, getOrder);
router.patch('/:id', authMiddleware, isChefOrCashier, updateOrder);

export default router;