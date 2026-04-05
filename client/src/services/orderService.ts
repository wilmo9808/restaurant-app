import { supabase } from '../config/supabase';
import { Order, OrderInput, DailyReport, TotalsData } from '../types/order';

export const createOrder = async (token: string, order: OrderInput): Promise<Order> => {
    // Obtener el usuario autenticado
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) throw new Error('Usuario no autenticado');

    // Crear la orden
    const { data: orderData, error: orderError } = await supabase
        .from('Order')
        .insert([
            {
                tableNumber: order.tableNumber,
                total: order.total,
                notes: order.notes,
                userId: user.id,
                status: 'PENDING',
            },
        ])
        .select()
        .single();

    if (orderError) throw new Error(orderError.message);

    // Crear los items de la orden
    const orderItems = order.items.map(item => ({
        orderId: orderData.id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        toppings: item.modifications ? JSON.stringify(item.modifications) : null,
    }));

    const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    // Obtener la orden completa con sus items
    const { data: fullOrder, error: fetchError } = await supabase
        .from('Order')
        .select(`
            *,
            items:OrderItem(*)
        `)
        .eq('id', orderData.id)
        .single();

    if (fetchError) throw new Error(fetchError.message);

    return fullOrder as Order;
};

export const getOrders = async (token: string, status?: string): Promise<Order[]> => {
    let query = supabase
        .from('Order')
        .select(`
            *,
            items:OrderItem(*)
        `)
        .order('createdAt', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data as Order[];
};

export const getOrderById = async (token: string, id: string): Promise<Order> => {
    const { data, error } = await supabase
        .from('Order')
        .select(`
            *,
            items:OrderItem(*)
        `)
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);

    return data as Order;
};

export const updateOrderStatus = async (token: string, id: string, status: string): Promise<Order> => {
    const { data, error } = await supabase
        .from('Order')
        .update({ status, updatedAt: new Date() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data as Order;
};

export const getDailyReport = async (token: string, date?: string): Promise<DailyReport> => {
    let query = supabase
        .from('Order')
        .select('*')
        .eq('status', 'COMPLETED');

    if (date) {
        // Filtrar por fecha específica
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        query = query
            .gte('createdAt', startDate.toISOString())
            .lte('createdAt', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = data.length;

    return {
        date: date ? new Date(date) : new Date(),
        totalOrders,
        totalRevenue,
        completedOrders: totalOrders,
        pendingOrders: 0,
        ordersByTable: {},
        orders: data,
    } as DailyReport;
};

export const getTotals = async (token: string): Promise<TotalsData> => {
    // Obtener todas las órdenes completadas
    const { data: completedOrders, error: completedError } = await supabase
        .from('Order')
        .select('total, createdAt')
        .eq('status', 'COMPLETED');

    if (completedError) throw new Error(completedError.message);

    // Obtener órdenes pendientes y en progreso
    const { count: pendingOrders, error: pendingError } = await supabase
        .from('Order')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

    if (pendingError) throw new Error(pendingError.message);

    const { count: inProgressOrders, error: inProgressError } = await supabase
        .from('Order')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'IN_PROGRESS');

    if (inProgressError) throw new Error(inProgressError.message);

    // Calcular ventas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = completedOrders
        .filter(order => new Date(order.createdAt) >= today)
        .reduce((sum, order) => sum + order.total, 0);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = completedOrders.length;

    return {
        todayRevenue,
        totalRevenue,
        totalOrders,
        pendingOrders: pendingOrders || 0,
        inProgressOrders: inProgressOrders || 0,
    };
};