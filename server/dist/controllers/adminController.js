"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopping = exports.updateTopping = exports.createTopping = exports.getToppings = exports.deleteProductPermanent = exports.restoreProduct = exports.archiveProduct = exports.updateProduct = exports.createProduct = exports.uploadProductImage = exports.getProducts = exports.deleteTable = exports.updateTable = exports.createTable = exports.getTables = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const socket_1 = require("../config/socket");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getErrorMessage = (error, fallback) => {
    if (process.env.NODE_ENV === 'production')
        return fallback;
    return error.message || fallback;
};
// ==================== USUARIOS ====================
const getUsers = async (req, res) => {
    try {
        const users = await database_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { email, name, password, role, isActive } = req.body;
        const existingUser = await database_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'El email ya está registrado' });
            return;
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        const user = await database_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || 'WAITER',
                isActive: isActive !== undefined ? isActive : true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role, isActive, password } = req.body;
        const updateData = {};
        if (email)
            updateData.email = email;
        if (name)
            updateData.name = name;
        if (role)
            updateData.role = role;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (password)
            updateData.password = await (0, bcrypt_1.hashPassword)(password);
        const user = await database_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.user.delete({
            where: { id },
        });
        res.status(200).json({ success: true, message: 'Usuario eliminado' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.deleteUser = deleteUser;
// ==================== MESAS ====================
const getTables = async (req, res) => {
    try {
        const tables = await database_1.default.table.findMany({
            orderBy: {
                number: 'asc',
            },
        });
        res.status(200).json({ success: true, data: tables });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.getTables = getTables;
const createTable = async (req, res) => {
    try {
        const { number, isActive } = req.body;
        const existingTable = await database_1.default.table.findUnique({
            where: { number },
        });
        if (existingTable) {
            res.status(400).json({ success: false, message: 'El número de mesa ya existe' });
            return;
        }
        const table = await database_1.default.table.create({
            data: {
                number,
                isActive: isActive !== undefined ? isActive : true,
            },
        });
        res.status(201).json({ success: true, data: table });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.createTable = createTable;
const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, isActive } = req.body;
        const table = await database_1.default.table.update({
            where: { id: parseInt(id) },
            data: {
                number,
                isActive,
            },
        });
        res.status(200).json({ success: true, data: table });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.updateTable = updateTable;
const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.table.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: 'Mesa eliminada' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.deleteTable = deleteTable;
// ==================== PRODUCTOS ====================
const getProducts = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.getProducts = getProducts;
const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No se recibió ninguna imagen' });
            return;
        }
        // Obtener la URL de Cloudinary desde multer-storage-cloudinary
        const imageUrl = req.file.path;
        res.status(200).json({ success: true, data: { imageUrl } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.uploadProductImage = uploadProductImage;
const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, isActive, imageUrl } = req.body;
        const product = await database_1.default.product.create({
            data: {
                name,
                price,
                category,
                description,
                imageUrl: imageUrl || null,
                isActive: isActive !== undefined ? isActive : true,
            },
        });
        const io = (0, socket_1.getIO)();
        io.emit(socket_1.SOCKET_EVENTS.MENU_UPDATED, { action: 'create', product });
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description, isActive, imageUrl } = req.body;
        const product = await database_1.default.product.update({
            where: { id },
            data: {
                name,
                price,
                category,
                description,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
                isActive,
            },
        });
        const io = (0, socket_1.getIO)();
        io.emit(socket_1.SOCKET_EVENTS.MENU_UPDATED, { action: 'update', product });
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.updateProduct = updateProduct;
// Soft Delete - Archivar producto (no eliminar físicamente)
const archiveProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await database_1.default.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        // Archivar (soft delete)
        const archivedProduct = await database_1.default.product.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
        const io = (0, socket_1.getIO)();
        io.emit(socket_1.SOCKET_EVENTS.MENU_UPDATED, { action: 'archive', productId: id });
        res.status(200).json({
            success: true,
            message: 'Producto archivado exitosamente. No aparecerá en el menú pero los reportes históricos se conservan.',
            data: archivedProduct
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.archiveProduct = archiveProduct;
// Restaurar producto archivado
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await database_1.default.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        const restoredProduct = await database_1.default.product.update({
            where: { id },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });
        const io = (0, socket_1.getIO)();
        io.emit(socket_1.SOCKET_EVENTS.MENU_UPDATED, { action: 'restore', productId: id });
        res.status(200).json({
            success: true,
            message: 'Producto restaurado exitosamente.',
            data: restoredProduct
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.restoreProduct = restoreProduct;
// Eliminación física solo para productos sin pedidos
const deleteProductPermanent = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await database_1.default.product.findUnique({ where: { id } });
        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }
        // Eliminar imagen asociada
        if (product && product.imageUrl) {
            try {
                const relativeUrl = product.imageUrl.startsWith('/') ? product.imageUrl.substring(1) : product.imageUrl;
                const imagePath = path_1.default.join(__dirname, '../../', relativeUrl);
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            catch (fsError) {
                console.error("No se pudo eliminar el archivo de imagen:", fsError);
            }
        }
        await database_1.default.product.delete({
            where: { id },
        });
        const io = (0, socket_1.getIO)();
        io.emit(socket_1.SOCKET_EVENTS.MENU_UPDATED, { action: 'delete', productId: id });
        res.status(200).json({ success: true, message: 'Producto eliminado permanentemente' });
    }
    catch (error) {
        let errorMessage = error.message;
        if (error.code === 'P2003') {
            errorMessage = 'No se puede eliminar el producto porque ya pertenece a uno o más pedidos en el historial. Use archivar en su lugar.';
        }
        res.status(500).json({ success: false, message: errorMessage });
    }
};
exports.deleteProductPermanent = deleteProductPermanent;
// ==================== TOPPINGS (antes MODIFICADORES) ====================
const getToppings = async (req, res) => {
    try {
        const toppings = await database_1.default.topping.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: toppings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.getToppings = getToppings;
const createTopping = async (req, res) => {
    try {
        const { name, price, isActive } = req.body;
        const topping = await database_1.default.topping.create({
            data: {
                name,
                price,
                isActive: isActive !== undefined ? isActive : true,
            },
        });
        res.status(201).json({ success: true, data: topping });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.createTopping = createTopping;
const updateTopping = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, isActive } = req.body;
        const topping = await database_1.default.topping.update({
            where: { id },
            data: {
                name,
                price,
                isActive,
            },
        });
        res.status(200).json({ success: true, data: topping });
    }
    catch (error) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};
exports.updateTopping = updateTopping;
const deleteTopping = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.topping.delete({
            where: { id },
        });
        res.status(200).json({ success: true, message: 'Topping eliminado' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTopping = deleteTopping;
