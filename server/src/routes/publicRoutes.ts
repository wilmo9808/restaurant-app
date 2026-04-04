import { Router } from 'express';
import { getPublicMenu, getPublicRestaurantName } from '../controllers/menuController';

const router = Router();

router.get('/menu', getPublicMenu);
router.get('/settings/restaurant_name', getPublicRestaurantName);

export default router;
