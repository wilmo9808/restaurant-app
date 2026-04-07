import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword } from '../utils/bcrypt';
import { getIO, SOCKET_EVENTS } from '../config/socket';
import path from 'path';
import fs from 'fs';

const getErrorMessage = (error: any, fallback: string) => {
    if (process.env.NODE_ENV === 'production') return fallback;
    return error.message || fallback;
};

// ==================== USUARIOS ====================

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password, role, isActive } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ success: false, message: 'El email ya está registrado' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || 'WAITER',
                isActive: isActive !== undefined ? isActive : true,
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

        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { email, name, role, isActive, password } = req.body;

        const updateData: any = {};
        if (email) updateData.email = email;
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password) updateData.password = await hashPassword(password);

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: 'Usuario eliminado' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

// ==================== MESAS ====================

export const getTables = async (req: Request, res: Response): Promise<void> => {
    try {
        const tables = await prisma.table.findMany({
            orderBy: {
                number: 'asc',
            },
        });
        res.status(200).json({ success: true, data: tables });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const createTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, isActive } = req.body;

        const existingTable = await prisma.table.findUnique({
            where: { number },
        });

        if (existingTable) {
            res.status(400).json({ success: false, message: 'El número de mesa ya existe' });
            return;
        }

        const table = await prisma.table.create({
            data: {
                number,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.TABLES_UPDATED, { action: 'create', table });

        res.status(201).json({ success: true, data: table });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const updateTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { number, isActive } = req.body;

        const table = await prisma.table.update({
            where: { id: parseInt(id) },
            data: {
                number,
                isActive,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.TABLES_UPDATED, { action: 'update', table });

        res.status(200).json({ success: true, data: table });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const deleteTable = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.table.delete({
            where: { id: parseInt(id) },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.TABLES_UPDATED, { action: 'delete', tableId: id });

        res.status(200).json({ success: true, message: 'Mesa eliminada' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

// ==================== PRODUCTOS ====================

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: products });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const uploadProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No se recibió ninguna imagen' });
            return;
        }

        // Obtener la URL de Cloudinary desde multer-storage-cloudinary
        const imageUrl = (req.file as any).path;

        res.status(200).json({ success: true, data: { imageUrl } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, category, description, isActive, imageUrl } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                price,
                category,
                description,
                imageUrl: imageUrl || null,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'create', product });

        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, category, description, isActive, imageUrl } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                category,
                description,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
                isActive,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'update', product });

        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

// Soft Delete - Archivar producto (no eliminar físicamente)
export const archiveProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }

        // Archivar (soft delete)
        const archivedProduct = await prisma.product.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'archive', productId: id });

        res.status(200).json({
            success: true,
            message: 'Producto archivado exitosamente. No aparecerá en el menú pero los reportes históricos se conservan.',
            data: archivedProduct
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

// Restaurar producto archivado
export const restoreProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }

        const restoredProduct = await prisma.product.update({
            where: { id },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'restore', productId: id });

        res.status(200).json({
            success: true,
            message: 'Producto restaurado exitosamente.',
            data: restoredProduct
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

// Eliminación física solo para productos sin pedidos
export const deleteProductPermanent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const product: any = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            res.status(404).json({ success: false, message: 'Producto no encontrado' });
            return;
        }

        // Eliminar imagen asociada
        if (product && product.imageUrl) {
            try {
                const relativeUrl = product.imageUrl.startsWith('/') ? product.imageUrl.substring(1) : product.imageUrl;
                const imagePath = path.join(__dirname, '../../', relativeUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (fsError) {
                console.error("No se pudo eliminar el archivo de imagen:", fsError);
            }
        }

        await prisma.product.delete({
            where: { id },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'delete', productId: id });

        res.status(200).json({ success: true, message: 'Producto eliminado permanentemente' });
    } catch (error: any) {
        let errorMessage = error.message;
        if (error.code === 'P2003') {
            errorMessage = 'No se puede eliminar el producto porque ya pertenece a uno o más pedidos en el historial. Use archivar en su lugar.';
        }
        res.status(500).json({ success: false, message: errorMessage });
    }
};

// ==================== TOPPINGS (antes MODIFICADORES) ====================

export const getToppings = async (req: Request, res: Response): Promise<void> => {
    try {
        const toppings = await prisma.topping.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ success: true, data: toppings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const createTopping = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, isActive } = req.body;

        const topping = await prisma.topping.create({
            data: {
                name,
                price,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'create', topping });

        res.status(201).json({ success: true, data: topping });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const updateTopping = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, isActive } = req.body;

        const topping = await prisma.topping.update({
            where: { id },
            data: {
                name,
                price,
                isActive,
            },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'update', topping });

        res.status(200).json({ success: true, data: topping });
    } catch (error: any) {
        res.status(500).json({ success: false, message: getErrorMessage(error, 'Error interno del servidor') });
    }
};

export const deleteTopping = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.topping.delete({
            where: { id },
        });

        const io = getIO();
        io.emit(SOCKET_EVENTS.MENU_UPDATED, { action: 'delete', toppingId: id });

        res.status(200).json({ success: true, message: 'Topping eliminado' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};