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

// Helper para fetch con autenticación
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
};

// ==================== USUARIOS ====================

export const getUsers = async (token: string): Promise<User[]> => {
    const response = await fetchWithAuth('/admin/users', { method: 'GET' }, token);
    return response.data;
};

export const createUser = async (token: string, data: UserCreateInput): Promise<User> => {
    const response = await fetchWithAuth('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const updateUser = async (token: string, id: string, data: UserUpdateInput): Promise<User> => {
    const response = await fetchWithAuth(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const deleteUser = async (token: string, id: string): Promise<void> => {
    await fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }, token);
};

// ==================== MESAS ====================

export const getTables = async (token: string): Promise<Table[]> => {
    const response = await fetchWithAuth('/admin/tables', { method: 'GET' }, token);
    return response.data;
};

export const createTable = async (token: string, data: TableCreateInput): Promise<Table> => {
    const response = await fetchWithAuth('/admin/tables', {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const updateTable = async (token: string, id: number, data: Partial<Table>): Promise<Table> => {
    const response = await fetchWithAuth(`/admin/tables/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const deleteTable = async (token: string, id: number): Promise<void> => {
    await fetchWithAuth(`/admin/tables/${id}`, { method: 'DELETE' }, token);
};

// ==================== PRODUCTOS ====================

export const getProducts = async (token: string): Promise<Product[]> => {
    const response = await fetchWithAuth('/admin/products', { method: 'GET' }, token);
    return response.data;
};

export const createProduct = async (token: string, data: ProductCreateInput): Promise<Product> => {
    const response = await fetchWithAuth('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const updateProduct = async (token: string, id: string, data: ProductUpdateInput): Promise<Product> => {
    const response = await fetchWithAuth(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const deleteProduct = async (token: string, id: string): Promise<void> => {
    await fetchWithAuth(`/admin/products/${id}`, { method: 'DELETE' }, token);
};

export const uploadProductImage = async (token: string, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/admin/products/upload-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
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
    const response = await fetchWithAuth('/admin/toppings', { method: 'GET' }, token);
    return response.data;
};

export const createTopping = async (token: string, data: ToppingCreateInput): Promise<Topping> => {
    const response = await fetchWithAuth('/admin/toppings', {
        method: 'POST',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const updateTopping = async (token: string, id: string, data: ToppingUpdateInput): Promise<Topping> => {
    const response = await fetchWithAuth(`/admin/toppings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }, token);
    return response.data;
};

export const deleteTopping = async (token: string, id: string): Promise<void> => {
    await fetchWithAuth(`/admin/toppings/${id}`, { method: 'DELETE' }, token);
};