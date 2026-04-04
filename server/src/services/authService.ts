import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken, TokenPayload } from '../utils/jwt';
import { UserCreateInput, UserLoginInput, UserResponse } from '../types/user';

export const registerUser = async (data: UserCreateInput): Promise<{ user: UserResponse; token: string }> => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error('El email ya está registrado');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: data.role || 'WAITER',
            isActive: data.isActive !== undefined ? data.isActive : true,
        },
    });

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const token = generateToken(payload);

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as any,
            isActive: user.isActive,
            createdAt: user.createdAt,
        },
        token,
    };
};

export const loginUser = async (data: UserLoginInput): Promise<{ user: UserResponse; token: string }> => {
    console.log('🔐 Intentando login con email:', data.email);

    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        console.log('❌ Usuario no encontrado:', data.email);
        throw new Error('Credenciales inválidas');
    }

    if (!user.isActive) {
        console.log('❌ Usuario inactivo:', data.email);
        throw new Error('Usuario inactivo. Contacte al administrador');
    }

    console.log('✅ Usuario encontrado:', user.email);
    console.log('📝 Hash almacenado:', user.password.substring(0, 20) + '...');

    const isPasswordValid = await comparePassword(data.password, user.password);

    console.log('🔑 ¿Contraseña válida?', isPasswordValid);

    if (!isPasswordValid) {
        console.log('❌ Contraseña incorrecta para:', data.email);
        throw new Error('Credenciales inválidas');
    }

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const token = generateToken(payload);

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as any,
            isActive: user.isActive,
            createdAt: user.createdAt,
        },
        token,
    };
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
};