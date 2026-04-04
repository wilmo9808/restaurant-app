export type Role = 'WAITER' | 'CHEF' | 'CASHIER';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
    role?: Role;
}