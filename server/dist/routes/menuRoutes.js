"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware_1.authMiddleware, menuController_1.getProducts);
router.get('/:id', authMiddleware_1.authMiddleware, menuController_1.getProduct);
router.post('/', authMiddleware_1.authMiddleware, roleMiddleware_1.isWaiter, menuController_1.addProduct);
exports.default = router;
