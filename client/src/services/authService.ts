import { post, get } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/user';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await post<{ success: boolean; data: AuthResponse }>('/auth/register', credentials);
    return response.data;
};

export const getProfile = async (token: string): Promise<User> => {
    const response = await get<{ success: boolean; data: User }>('/auth/profile', token);
    return response.data;
};

export const checkFirstAdmin = async (): Promise<{ hasAdmin: boolean }> => {
    const response = await get<{ success: boolean; data: { hasAdmin: boolean } }>('/auth/check-first-admin');
    return response.data;
};

export const registerFirstAdmin = async (data: { name: string; email: string; password: string }): Promise<User> => {
    const response = await post<{ success: boolean; data: User }>('/auth/register-first-admin', data);
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