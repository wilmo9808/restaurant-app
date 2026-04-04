export interface Modifier {
    id: string;
    name: string;
    price: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
    modifiers?: Modifier[];
}

export interface ProductInput {
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
    modifiers?: Omit<Modifier, 'id'>[];
}

export interface ProductUpdateInput {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
}