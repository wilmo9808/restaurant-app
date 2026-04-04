import { Router } from 'express';
import { register, login, getProfile, checkFirstAdmin, registerFirstAdmin } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateLogin } from '../middleware/validationMiddleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Limitador estricto para inicio de sesión contra ataques de fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.' }
});

router.post('/register', register);
router.post('/login', loginLimiter, validateLogin, login);
router.get('/profile', authMiddleware, getProfile);
router.get('/check-first-admin', checkFirstAdmin);
router.post('/register-first-admin', registerFirstAdmin);

export default router;