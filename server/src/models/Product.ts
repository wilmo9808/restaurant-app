export interface Modifier {
    id: string;
    name: string;
    price: number;
    productId?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string | null;
    modifiers?: Modifier[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductCreateInput {
    name: string;
    price: number;
    category: string;
    description?: string;
    modifiers?: Omit<Modifier, 'id' | 'productId'>[];
}

export interface ProductUpdateInput {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
}

export interface ProductResponse {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string | null;
    modifiers?: Modifier[];
}