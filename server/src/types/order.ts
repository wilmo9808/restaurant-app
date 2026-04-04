export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';

export interface OrderItemModification {
    modifierId?: string;
    modifierName: string;
    price: number;
}

export interface OrderItemInput {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    modifications?: OrderItemModification[];
}

export interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    modifications?: OrderItemModification[];
}

export interface OrderInput {
    tableNumber: number;
    items: OrderItemInput[];
    total: number;
    notes?: string;
}

export interface OrderResponse {
    id: string;
    tableNumber: number;
    status: OrderStatus;
    total: number;
    userId: string;
    userName: string;
    items: OrderItemResponse[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderUpdateInput {
    status?: OrderStatus;
}