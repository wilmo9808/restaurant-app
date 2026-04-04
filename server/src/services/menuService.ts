import prisma from '../config/database';
import { Product, ProductInput } from '../types/product';

export const getAllProducts = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null, // No mostrar productos archivados
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: (product as any).imageUrl || undefined,
    }));
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: {
            category,
            isActive: true,
            deletedAt: null, // No mostrar productos archivados
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: (product as any).imageUrl || undefined,
    }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) return null;

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: (product as any).imageUrl || undefined,
    };
};

export const createProduct = async (data: ProductInput): Promise<Product> => {
    const product = await prisma.product.create({
        data: {
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description,
            isActive: true,
        },
    });

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
    };
};