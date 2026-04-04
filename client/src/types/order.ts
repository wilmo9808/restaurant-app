export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';

export interface OrderItemModification {
    modifierId?: string;
    modifierName: string;
    price: number;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    modifications?: OrderItemModification[];
}

export interface OrderItemInput {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    modifications?: OrderItemModification[];
}

export interface Order {
    id: string;
    tableNumber: number;
    status: OrderStatus;
    total: number;
    userId: string;
    userName: string;
    items: OrderItem[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderInput {
    tableNumber: number;
    items: OrderItemInput[];
    total: number;
    notes?: string;
}

export interface OrderUpdateInput {
    status?: OrderStatus;
}

export interface DailyReport {
    date: Date;
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
    ordersByTable: Record<number, number>;
    orders: Order[];
}

export interface TotalsData {
    todayRevenue: number;
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    inProgressOrders: number;
}