export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
}

export interface ProductInput {
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
}

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export interface ToppingInput {
    name: string;
    price: number;
    isActive?: boolean;
}