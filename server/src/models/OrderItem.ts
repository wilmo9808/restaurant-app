export interface OrderItemModification {
    modifierId?: string;
    modifierName: string;
    price: number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
    subtotal: number;
    modifications?: OrderItemModification[] | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItemInput {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    modifications?: OrderItemModification[];
}

export interface OrderItemCreateInput {
    orderId: string;
    productId: string;
    quantity: number;
    subtotal: number;
    modifications?: string;
}

export interface OrderItemUpdateInput {
    quantity?: number;
    subtotal?: number;
    modifications?: string;
}