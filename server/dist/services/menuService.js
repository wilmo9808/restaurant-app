"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProductById = exports.getProductsByCategory = exports.getAllProducts = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllProducts = async () => {
    const products = await database_1.default.product.findMany({
        where: {
            isActive: true,
            deletedAt: null, // No mostrar productos archivados
        },
    });
    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || undefined,
    }));
};
exports.getAllProducts = getAllProducts;
const getProductsByCategory = async (category) => {
    const products = await database_1.default.product.findMany({
        where: {
            category,
            isActive: true,
            deletedAt: null, // No mostrar productos archivados
        },
    });
    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || undefined,
    }));
};
exports.getProductsByCategory = getProductsByCategory;
const getProductById = async (id) => {
    const product = await database_1.default.product.findUnique({
        where: { id },
    });
    if (!product)
        return null;
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || undefined,
    };
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    const product = await database_1.default.product.create({
        data: {
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description,
            isActive: true,
        },
    });
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
    };
};
exports.createProduct = createProduct;
