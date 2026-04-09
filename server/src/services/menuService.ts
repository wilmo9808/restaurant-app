import prisma from '../config/database';
import { Product, ProductInput } from '../types/product';

export const getAllProducts = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            price: true,
            category: true,
            description: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || null,
    }));
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: {
            category,
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            price: true,
            category: true,
            description: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || null,
    }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            price: true,
            category: true,
            description: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!product) return null;

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || null,
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
        select: {
            id: true,
            name: true,
            price: true,
            category: true,
            description: true,
            imageUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || undefined,
        imageUrl: product.imageUrl || null,
    };
};