import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/roleMiddleware';
import { uploadProductImage } from '../controllers/adminController';
import {
    // Usuarios
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    // Mesas
    getTables,
    createTable,
    updateTable,
    deleteTable,
    // Productos
    getProducts,
    createProduct,
    updateProduct,
    deleteProductPermanent,
    archiveProduct,
    restoreProduct,
    // Toppings
    getToppings,
    createTopping,
    updateTopping,
    deleteTopping,
} from '../controllers/adminController';
import { upload } from '../config/multer';

const router = Router();

// Todas las rutas de admin requieren autenticación y rol SUPER_ADMIN
router.use(authMiddleware, isAdmin);

// ==================== USUARIOS ====================
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ==================== MESAS ====================
router.get('/tables', getTables);
router.post('/tables', createTable);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

// ==================== PRODUCTOS ====================
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProductPermanent);
router.post('/products/upload-image', upload.single('image'), uploadProductImage);
router.delete('/products/:id/archive', archiveProduct);
router.post('/products/:id/restore', restoreProduct);

// ==================== TOPPINGS ====================
router.get('/toppings', getToppings);
router.post('/toppings', createTopping);
router.put('/toppings/:id', updateTopping);
router.delete('/toppings/:id', deleteTopping);

export default router;