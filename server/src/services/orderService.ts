import prisma from '../config/database';
import { OrderInput, OrderResponse, OrderUpdateInput, OrderItemInput } from '../types/order';

// Función para transformar toppings al formato esperado por el frontend
const transformToppings = (toppings: any[] | null | undefined): any[] | undefined => {
    if (!toppings) return undefined;
    return toppings.map(topping => ({
        modifierId: topping.toppingId || topping.modifierId,
        modifierName: topping.toppingName || topping.modifierName,
        price: topping.price,
    }));
};

// Función para preparar toppings para guardar en BD
const prepareToppingsForSave = (modifications: any[] | undefined): string | null => {
    if (!modifications || modifications.length === 0) return null;
    // Guardar con el formato que tiene el frontend
    return JSON.stringify(modifications);
};

export const createOrder = async (data: OrderInput, userId: string): Promise<OrderResponse> => {
    // Obtener nombres de productos desde la base de datos (solo activos)
    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },
            isActive: true,
            deletedAt: null,
        },
        select: { id: true, name: true, price: true }
    });

    // Verificar que todos los productos existan y estén activos
    const productMap = new Map(products.map(p => [p.id, p]));
    const missingProducts = productIds.filter(id => !productMap.has(id));
    if (missingProducts.length > 0) {
        throw new Error('Algunos productos no están disponibles o fueron desactivados');
    }

    // Recalcular el total en el servidor para evitar manipulación
    let calculatedTotal = 0;
    const orderItemsData = data.items.map((item: OrderItemInput) => {
        const product = productMap.get(item.productId)!;
        const baseSubtotal = product.price * item.quantity;
        
        let toppingsTotal = 0;
        if (item.modifications && item.modifications.length > 0) {
            toppingsTotal = item.modifications.reduce((sum, mod) => sum + mod.price, 0) * item.quantity;
        }
        
        const subtotal = baseSubtotal + toppingsTotal;
        calculatedTotal += subtotal;

        return {
            productId: item.productId,
            quantity: item.quantity,
            subtotal: subtotal,
            toppings: prepareToppingsForSave(item.modifications),
        };
    });

    const order = await prisma.order.create({
        data: {
            tableNumber: data.tableNumber,
            total: calculatedTotal,
            userId: userId,
            notes: data.notes || null,
            items: {
                create: orderItemsData,
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
        status: order.status as any,
        total: order.total,
        userId: order.userId,
        userName: order.user.name,
        notes: order.notes || undefined,
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: productMap.get(item.productId)?.name || item.productId,
            quantity: item.quantity,
            price: item.subtotal / item.quantity,
            subtotal: item.subtotal,
            modifications: transformToppings(item.toppings ? JSON.parse(item.toppings) : null),
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};

export const getAllOrders = async (): Promise<OrderResponse[]> => {
    const orders = await prisma.order.findMany({
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
    const products = await prisma.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    return orders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status as any,
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

export const getOrderById = async (id: string): Promise<OrderResponse | null> => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: true,
            user: true,
        },
    });

    if (!order) return null;

    const productIds = order.items.map(i => i.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    return {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status as any,
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

export const updateOrderStatus = async (id: string, data: OrderUpdateInput): Promise<OrderResponse> => {
    const order = await prisma.order.update({
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
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    return {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status as any,
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

export const getOrdersByStatus = async (status: string): Promise<OrderResponse[]> => {
    const orders = await prisma.order.findMany({
        where: { status: status as any },
        include: {
            items: true,
            user: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const allProductIds = [...new Set(orders.flatMap(o => o.items.map(i => i.productId)))];
    const products = await prisma.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true }
    });
    const productMap = new Map(products.map(p => [p.id, p.name]));

    return orders.map((order) => ({
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status as any,
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