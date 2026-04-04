export type Role = 'WAITER' | 'CHEF' | 'CASHIER';

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    password: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface UserCreateInput {
    email: string;
    name: string;
    password: string;
    role?: Role;
}

export interface UserUpdateInput {
    email?: string;
    name?: string;
    password?: string;
    role?: Role;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
}