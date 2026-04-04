import { get, post, put, del } from './api';

// ==================== TIPOS ====================

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface UserCreateInput {
    email: string;
    name: string;
    password: string;
    role?: string;
    isActive?: boolean;
}

export interface UserUpdateInput {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
}

export interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

export interface TableCreateInput {
    number: number;
    isActive?: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface ProductCreateInput {
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
}

export interface ProductUpdateInput {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
}

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export interface ToppingCreateInput {
    name: string;
    price: number;
    isActive?: boolean;
}

export interface ToppingUpdateInput {
    name?: string;
    price?: number;
    isActive?: boolean;
}

// ==================== USUARIOS ====================

export const getUsers = async (token: string): Promise<User[]> => {
    const response = await get<{ success: boolean; data: User[] }>('/admin/users', token);
    return response.data;
};

export const createUser = async (token: string, data: UserCreateInput): Promise<User> => {
    const response = await post<{ success: boolean; data: User }>('/admin/users', data, token);
    return response.data;
};

export const updateUser = async (token: string, id: string, data: UserUpdateInput): Promise<User> => {
    const response = await put<{ success: boolean; data: User }>(`/admin/users/${id}`, data, token);
    return response.data;
};

export const deleteUser = async (token: string, id: string): Promise<void> => {
    await del(`/admin/users/${id}`, token);
};

// ==================== MESAS ====================

export const getTables = async (token: string): Promise<Table[]> => {
    const response = await get<{ success: boolean; data: Table[] }>('/admin/tables', token);
    return response.data;
};

export const createTable = async (token: string, data: TableCreateInput): Promise<Table> => {
    const response = await post<{ success: boolean; data: Table }>('/admin/tables', data, token);
    return response.data;
};

export const updateTable = async (token: string, id: number, data: Partial<Table>): Promise<Table> => {
    const response = await put<{ success: boolean; data: Table }>(`/admin/tables/${id}`, data, token);
    return response.data;
};

export const deleteTable = async (token: string, id: number): Promise<void> => {
    await del(`/admin/tables/${id}`, token);
};

// ==================== PRODUCTOS ====================

export const getProducts = async (token: string): Promise<Product[]> => {
    const response = await get<{ success: boolean; data: Product[] }>('/admin/products', token);
    return response.data;
};

export const createProduct = async (token: string, data: ProductCreateInput): Promise<Product> => {
    const response = await post<{ success: boolean; data: Product }>('/admin/products', data, token);
    return response.data;
};

export const updateProduct = async (token: string, id: string, data: ProductUpdateInput): Promise<Product> => {
    const response = await put<{ success: boolean; data: Product }>(`/admin/products/${id}`, data, token);
    return response.data;
};

export const deleteProduct = async (token: string, id: string): Promise<void> => {
    await del(`/admin/products/${id}`, token);
};

export const uploadProductImage = async (token: string, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3000/api/admin/products/upload-image', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al subir imagen');
    }
    return data.data;
};

// ==================== TOPPINGS ====================

export const getToppings = async (token: string): Promise<Topping[]> => {
    const response = await get<{ success: boolean; data: Topping[] }>('/admin/toppings', token);
    return response.data;
};

export const createTopping = async (token: string, data: ToppingCreateInput): Promise<Topping> => {
    const response = await post<{ success: boolean; data: Topping }>('/admin/toppings', data, token);
    return response.data;
};

export const updateTopping = async (token: string, id: string, data: ToppingUpdateInput): Promise<Topping> => {
    const response = await put<{ success: boolean; data: Topping }>(`/admin/toppings/${id}`, data, token);
    return response.data;
};

export const deleteTopping = async (token: string, id: string): Promise<void> => {
    await del(`/admin/toppings/${id}`, token);
};