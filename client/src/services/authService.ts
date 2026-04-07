import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const fetchWithoutAuth = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

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

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetchWithoutAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetchWithoutAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    return response.data;
};

export const getProfile = async (token: string): Promise<User> => {
    const response = await fetchWithAuth('/auth/profile', { method: 'GET' }, token);
    return response.data;
};

export const checkFirstAdmin = async (): Promise<{ hasAdmin: boolean }> => {
    const response = await fetchWithoutAuth('/auth/check-first-admin', { method: 'GET' });
    return response.data;
};

export const registerFirstAdmin = async (data: { name: string; email: string; password: string }): Promise<User> => {
    const response = await fetchWithoutAuth('/auth/register-first-admin', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.data;
};

export const saveToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const saveUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const removeUser = (): void => {
    localStorage.removeItem('user');
};

export const logout = (): void => {
    removeToken();
    removeUser();
};