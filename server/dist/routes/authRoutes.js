"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
// Limitador estricto para inicio de sesión contra ataques de fuerza bruta
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Demasiados intentos fallidos. Intenta nuevamente en 15 minutos.' }
});
router.post('/register', authController_1.register);
router.post('/login', loginLimiter, validationMiddleware_1.validateLogin, authController_1.login);
router.get('/profile', authMiddleware_1.authMiddleware, authController_1.getProfile);
router.get('/check-first-admin', authController_1.checkFirstAdmin);
router.post('/register-first-admin', authController_1.registerFirstAdmin);
exports.default = router;
