"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicRestaurantName = exports.getPublicMenu = exports.addProduct = exports.getProduct = exports.getProducts = void 0;
const menuService_1 = require("../services/menuService");
const database_1 = __importDefault(require("../config/database"));
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let products;
        if (category && typeof category === 'string') {
            products = await (0, menuService_1.getProductsByCategory)(category);
        }
        else {
            products = await (0, menuService_1.getAllProducts)();
        }
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener productos',
        });
    }
};
exports.getProducts = getProducts;
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await (0, menuService_1.getProductById)(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener producto',
        });
    }
};
exports.getProduct = getProduct;
const addProduct = async (req, res) => {
    try {
        const product = await (0, menuService_1.createProduct)(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: product,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear producto',
        });
    }
};
exports.addProduct = addProduct;
// ==================== ENDPOINTS PÚBLICOS ====================
const getPublicMenu = async (req, res) => {
    try {
        const products = await (0, menuService_1.getAllProducts)();
        // Filtrar solo productos activos y devolver imageUrl
        const activeProducts = products
            .filter(p => p.isActive !== false)
            .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
            imageUrl: p.imageUrl || null,
        }));
        res.status(200).json({
            success: true,
            data: activeProducts,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener menú público',
        });
    }
};
exports.getPublicMenu = getPublicMenu;
const getPublicRestaurantName = async (req, res) => {
    try {
        const setting = await database_1.default.setting.findUnique({
            where: { key: 'restaurant_name' },
        });
        res.status(200).json({
            success: true,
            data: setting?.value || 'RestoApp',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener nombre del restaurante',
        });
    }
};
exports.getPublicRestaurantName = getPublicRestaurantName;
