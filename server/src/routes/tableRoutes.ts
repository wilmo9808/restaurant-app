import { Router } from 'express';
import prisma from '../config/database';

const router = Router();

// Endpoint público para obtener mesas activas
router.get('/active', async (req, res) => {
    try {
        const tables = await prisma.table.findMany({
            where: { isActive: true },
            orderBy: { number: 'asc' },
            select: { id: true, number: true, isActive: true }
        });
        res.status(200).json({ success: true, data: tables });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;