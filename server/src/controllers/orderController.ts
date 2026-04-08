import { Request, Response } from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, getOrdersByStatus } from '../services/orderService';
import { getIO, SOCKET_EVENTS } from '../config/socket';

export const createNewOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'No autenticado',
            });
            return;
        }

        const order = await createOrder(req.body, userId);

        const io = getIO();
        console.log(`📣 [SERVER EVENT] Emitiendo NEW_ORDER globalmente. ID: ${order.id.slice(-6)}`);
        io.emit(SOCKET_EVENTS.NEW_ORDER, order);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: order,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear pedido',
        });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.query;

        let orders;
        if (status && typeof status === 'string') {
            orders = await getOrdersByStatus(status);
        } else {
            orders = await getAllOrders();
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener pedidos',
        });
    }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const order = await getOrderById(id);

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener pedido',
        });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await updateOrderStatus(id, { status });

        const io = getIO();
        console.log(`📣 [SERVER EVENT] Emitiendo ORDER_STATUS_CHANGED globalmente. ID: ${id.slice(-6)}, Estado: ${status}`);
        io.emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, { orderId: id, status });
        io.emit(SOCKET_EVENTS.ORDER_UPDATED, order);

        res.status(200).json({
            success: true,
            message: 'Pedido actualizado exitosamente',
            data: order,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al actualizar pedido',
        });
    }
};