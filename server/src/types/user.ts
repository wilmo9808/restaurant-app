export type Role = 'WAITER' | 'CHEF' | 'CASHIER' | 'SUPER_ADMIN';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    password: string;
    isActive: boolean;
    createdAt: Date;
}

export interface UserCreateInput {
    email: string;
    name: string;
    password: string;
    role?: Role;
    isActive?: boolean;
}

export interface UserUpdateInput {
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
    isActive?: boolean;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
}