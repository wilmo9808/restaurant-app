import { Router } from 'express';
import prisma from '../config/database';

const router = Router();

// Endpoint público para obtener toppings activos
router.get('/active', async (req, res) => {
    try {
        const toppings = await prisma.topping.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
        res.status(200).json({ success: true, data: toppings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;