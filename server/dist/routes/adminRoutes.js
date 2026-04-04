"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const adminController_1 = require("../controllers/adminController");
const adminController_2 = require("../controllers/adminController");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
// Todas las rutas de admin requieren autenticación y rol SUPER_ADMIN
router.use(authMiddleware_1.authMiddleware, roleMiddleware_1.isAdmin);
// ==================== USUARIOS ====================
router.get('/users', adminController_2.getUsers);
router.post('/users', adminController_2.createUser);
router.put('/users/:id', adminController_2.updateUser);
router.delete('/users/:id', adminController_2.deleteUser);
// ==================== MESAS ====================
router.get('/tables', adminController_2.getTables);
router.post('/tables', adminController_2.createTable);
router.put('/tables/:id', adminController_2.updateTable);
router.delete('/tables/:id', adminController_2.deleteTable);
// ==================== PRODUCTOS ====================
router.get('/products', adminController_2.getProducts);
router.post('/products', adminController_2.createProduct);
router.put('/products/:id', adminController_2.updateProduct);
router.delete('/products/:id', adminController_2.deleteProductPermanent);
router.post('/products/upload-image', multer_1.upload.single('image'), adminController_1.uploadProductImage);
router.delete('/products/:id/archive', adminController_2.archiveProduct);
router.post('/products/:id/restore', adminController_2.restoreProduct);
// ==================== TOPPINGS ====================
router.get('/toppings', adminController_2.getToppings);
router.post('/toppings', adminController_2.createTopping);
router.put('/toppings/:id', adminController_2.updateTopping);
router.delete('/toppings/:id', adminController_2.deleteTopping);
exports.default = router;
