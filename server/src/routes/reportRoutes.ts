import { Router } from 'express';
import { getDailyReport, getTotals, exportDailyReportToExcel } from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { isCashier } from '../middleware/roleMiddleware';

const router = Router();

router.get('/daily', authMiddleware, isCashier, getDailyReport);
router.get('/totals', authMiddleware, isCashier, getTotals);
router.get('/export-excel', authMiddleware, isCashier, exportDailyReportToExcel);

export default router;