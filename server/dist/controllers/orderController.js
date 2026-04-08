"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.getOrder = exports.getOrders = exports.createNewOrder = void 0;
const orderService_1 = require("../services/orderService");
const socket_1 = require("../config/socket");
const createNewOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'No autenticado',
            });
            return;
        }
        const order = await (0, orderService_1.createOrder)(req.body, userId);
        const io = (0, socket_1.getIO)();
        console.log(`📣 [SERVER EVENT] Emitiendo NEW_ORDER globalmente. ID: ${order.id.slice(-6)}`);
        io.emit(socket_1.SOCKET_EVENTS.NEW_ORDER, order);
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear pedido',
        });
    }
};
exports.createNewOrder = createNewOrder;
const getOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let orders;
        if (status && typeof status === 'string') {
            orders = await (0, orderService_1.getOrdersByStatus)(status);
        }
        else {
            orders = await (0, orderService_1.getAllOrders)();
        }
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener pedidos',
        });
    }
};
exports.getOrders = getOrders;
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await (0, orderService_1.getOrderById)(id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Pedido no encontrado',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener pedido',
        });
    }
};
exports.getOrder = getOrder;
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await (0, orderService_1.updateOrderStatus)(id, { status });
        const io = (0, socket_1.getIO)();
        console.log(`📣 [SERVER EVENT] Emitiendo ORDER_STATUS_CHANGED globalmente. ID: ${id.slice(-6)}, Estado: ${status}`);
        io.emit(socket_1.SOCKET_EVENTS.ORDER_STATUS_CHANGED, { orderId: id, status });
        io.emit(socket_1.SOCKET_EVENTS.ORDER_UPDATED, order);
        res.status(200).json({
            success: true,
            message: 'Pedido actualizado exitosamente',
            data: order,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al actualizar pedido',
        });
    }
};
exports.updateOrder = updateOrder;
