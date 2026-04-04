import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import prisma from '../config/database';
import { hashPassword } from '../utils/bcrypt';

const getErrorMessage = (error: any, fallback: string) => {
    if (process.env.NODE_ENV === 'production') return fallback;
    return error.message || fallback;
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, role } = req.body;

        const result = await registerUser({
            email,
            password,
            name,
            role,
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: getErrorMessage(error, 'Error al registrar usuario'),
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const result = await loginUser({
            email,
            password,
        });

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: result,
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: getErrorMessage(error, 'Error al iniciar sesión'),
        });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'No autenticado',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al obtener perfil'),
        });
    }
};

// ==================== REGISTRO DE PRIMER ADMIN ====================

export const checkFirstAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminExists = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });

        res.status(200).json({
            success: true,
            data: { hasAdmin: !!adminExists },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al verificar administrador'),
        });
    }
};

export const registerFirstAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body;

        // Verificar si ya existe un SUPER_ADMIN
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });

        if (existingAdmin) {
            res.status(403).json({
                success: false,
                message: 'Ya existe un administrador en el sistema. No se puede crear otro.',
            });
            return;
        }

        // Validar campos requeridos
        if (!email || !name || !password) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
            });
            return;
        }

        // Validar email único
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado',
            });
            return;
        }

        // Crear SUPER_ADMIN
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Administrador creado exitosamente. Ahora puedes iniciar sesión.',
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al crear administrador'),
        });
    }
};