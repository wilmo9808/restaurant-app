import { Request, Response } from 'express';
import { getAllProducts, getProductsByCategory, getProductById, createProduct } from '../services/menuService';
import prisma from '../config/database';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.query;

        let products;
        if (category && typeof category === 'string') {
            products = await getProductsByCategory(category);
        } else {
            products = await getAllProducts();
        }

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener productos',
        });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener producto',
        });
    }
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await createProduct(req.body);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: product,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al crear producto',
        });
    }
};

// ==================== ENDPOINTS PÚBLICOS ====================

export const getPublicMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await getAllProducts();

        // Filtrar solo productos activos y devolver imageUrl
        const activeProducts = products
            .filter(p => p.isActive !== false)
            .map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
                description: p.description,
                imageUrl: p.imageUrl || null,
            }));

        res.status(200).json({
            success: true,
            data: activeProducts,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener menú público',
        });
    }
};

export const getPublicRestaurantName = async (req: Request, res: Response): Promise<void> => {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: 'restaurant_name' },
        });

        res.status(200).json({
            success: true,
            data: setting?.value || 'RestoApp',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener nombre del restaurante',
        });
    }
};