"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByStatus = exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const database_1 = __importDefault(require("../config/database"));
// Función para transformar toppings al formato esperado por el frontend
const transformToppings = (toppings) => {
    if (!toppings)
        return undefined;
    return toppings.map(topping => ({
        modifierId: topping.toppingId || topping.modifierId,
        modifierName: topping.toppingName || topping.modifierName,
        price: topping.price,
    }));
};
// Función para preparar toppings para guardar en BD
const prepareToppingsForSave = (modifications) => {
    if (!modifications || modifications.length === 0)
        return null;
    // Guardar con el formato que tiene el frontend
    return JSON.stringify(modifications);
};
const createOrder = async (data, userId) => {
    // Obtener nombres de productos desde la base de datos
    const productIds = data.items.map(item => item.productId);
    const products = await database_1.default.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));
    const order = await database_1.default.order.create({
        data: {
            tableNumber: data.tableNumber,
            total: data.total,
            userId: userId,
            notes: data.notes || null,
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                    toppings: prepareToppingsForSave(item.modifications),
                })),
            },
        },
        include: {
            items: true,
            user: true,
        },
    });
    return {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId) || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
exports.createOrder = createOrder;
const getAllOrders = async () => {
    const orders = await database_1.default.order.findMany({
        include: {
            items: true,
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    // Obtener todos los productos para mapear nombres
    const allProductIds = [...new Set(orders.flatMap(o => o.items.map(i => i.productId)))];
    const products = await database_1.default.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));
    return orders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId) || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (id) => {
    const order = await database_1.default.order.findUnique({
        where: { id },
        include: {
            items: true,
            user: true,
        },
    });
    if (!order)
        return null;
    const productIds = order.items.map(i => i.productId);
    const products = await database_1.default.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));
    return {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId) || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (id, data) => {
    const order = await database_1.default.order.update({
        where: { id },
        data: {
            status: data.status,
        },
        include: {
            items: true,
            user: true,
        },
    });
    const productIds = order.items.map(i => i.productId);
    const products = await database_1.default.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));
    return {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId) || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
exports.updateOrderStatus = updateOrderStatus;
const getOrdersByStatus = async (status) => {
    const orders = await database_1.default.order.findMany({
        where: { status: status },
        include: {
            items: true,
            user: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    const allProductIds = [...new Set(orders.flatMap(o => o.items.map(i => i.productId)))];
    const products = await database_1.default.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));
    return orders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId) || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));
};
exports.getOrdersByStatus = getOrdersByStatus;
