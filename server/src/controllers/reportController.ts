import { Request, Response } from 'express';
import prisma from '../config/database';
import XLSX from 'xlsx';

export const getDailyReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.query;
        let targetDate;
        if (date) {
            const [year, month, day] = (date as string).split('-');
            targetDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        } else {
            targetDate = new Date();
        }

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                user: true,
                items: true,
            },
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

        const ordersByTable = orders.reduce((acc, order) => {
            acc[order.tableNumber] = (acc[order.tableNumber] || 0) + order.total;
            return acc;
        }, {} as Record<number, number>);

        res.status(200).json({
            success: true,
            data: {
                date: startOfDay,
                totalOrders,
                totalRevenue,
                completedOrders,
                pendingOrders,
                ordersByTable,
                orders,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al generar reporte',
        });
    }
};

export const getTotals = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: 'COMPLETED',
            },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = orders.filter(order => order.createdAt >= today);
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;

        const pendingOrders = await prisma.order.count({
            where: {
                status: 'PENDING',
            },
        });

        const inProgressOrders = await prisma.order.count({
            where: {
                status: 'IN_PROGRESS',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                todayRevenue,
                totalRevenue,
                totalOrders,
                pendingOrders,
                inProgressOrders,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener totales',
        });
    }
};

export const exportDailyReportToExcel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.query;
        let targetDate;
        if (date) {
            const [year, month, day] = (date as string).split('-');
            targetDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        } else {
            targetDate = new Date();
        }

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: 'COMPLETED',
            },
            include: {
                user: true,
                items: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Preparar datos para Excel
        const excelData: any[] = [];

        orders.forEach((order) => {
            order.items.forEach((item) => {
                // Parsear toppings si existen
                let toppingsText = '';
                if (item.toppings) {
                    try {
                        const toppings = JSON.parse(item.toppings);
                        toppingsText = toppings.map((t: any) => `${t.toppingName || t.modifierName} (${t.price})`).join(', ');
                    } catch (e) {
                        toppingsText = '';
                    }
                }

                excelData.push({
                    'Fecha': new Date(order.createdAt).toLocaleString('es-CO'),
                    'Pedido #': order.id.slice(-8),
                    'Mesa': order.tableNumber,
                    'Producto': item.productId, // Se reemplazará después con nombre
                    'Cantidad': item.quantity,
                    'Precio Unitario': item.subtotal / item.quantity,
                    'Subtotal': item.subtotal,
                    'Toppings': toppingsText,
                    'Total Pedido': order.total,
                    'Estado': order.status,
                    'Mesero': order.user.name,
                    'Notas': order.notes || '',
                });
            });
        });

        // Obtener nombres de productos
        const productIds = [...new Set(excelData.map(d => d.Producto))];
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true }
        });
        const productMap = new Map(products.map(p => [p.id, p.name]));

        // Reemplazar IDs por nombres
        excelData.forEach(row => {
            row.Producto = productMap.get(row.Producto) || row.Producto;
        });

        // Calcular resumen
        const totalVentas = orders.reduce((sum, order) => sum + order.total, 0);
        const totalPedidos = orders.length;
        const totalProductos = excelData.length;

        // Agregar filas de resumen
        excelData.push({});
        excelData.push({ 'Resumen': 'RESUMEN DEL DÍA' });
        excelData.push({ 'Resumen': 'Total Ventas', 'Valor': totalVentas });
        excelData.push({ 'Resumen': 'Total Pedidos', 'Valor': totalPedidos });
        excelData.push({ 'Resumen': 'Total Productos Vendidos', 'Valor': totalProductos });

        // Crear hoja de Excel
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Diario');

        // Ajustar ancho de columnas
        const colWidths = [
            { wch: 20 }, // Fecha
            { wch: 12 }, // Pedido #
            { wch: 8 },  // Mesa
            { wch: 25 }, // Producto
            { wch: 8 },  // Cantidad
            { wch: 15 }, // Precio Unitario
            { wch: 15 }, // Subtotal
            { wch: 30 }, // Toppings
            { wch: 15 }, // Total Pedido
            { wch: 12 }, // Estado
            { wch: 15 }, // Mesero
            { wch: 30 }, // Notas
        ];
        worksheet['!cols'] = colWidths;

        // Generar archivo Excel
        const fileName = `reporte_${targetDate.toISOString().split('T')[0]}.xlsx`;
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(buffer);
    } catch (error: any) {
        console.error('Error exportando Excel:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al exportar reporte',
        });
    }
};