import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';

// Tipos temporales mientras se construyen los servicios
interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    isActive: boolean;
}

interface Modifier {
    id: string;
    name: string;
    price: number;
    productId: string;
    isActive: boolean;
}

export const useAdmin = () => {
    const { token } = useAuthStore();
    const { showToast } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);

    // Usuarios
    const [users, setUsers] = useState<User[]>([]);

    // Mesas
    const [tables, setTables] = useState<Table[]>([]);

    // Productos
    const [products, setProducts] = useState<Product[]>([]);

    // Modificadores
    const [modifiers, setModifiers] = useState<Modifier[]>([]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // TODO: Implementar llamada a API
            console.log('Fetching users...');
        } catch (error) {
            showToast('Error al cargar usuarios', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTables = async () => {
        setIsLoading(true);
        try {
            // TODO: Implementar llamada a API
            console.log('Fetching tables...');
        } catch (error) {
            showToast('Error al cargar mesas', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // TODO: Implementar llamada a API
            console.log('Fetching products...');
        } catch (error) {
            showToast('Error al cargar productos', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchModifiers = async () => {
        setIsLoading(true);
        try {
            // TODO: Implementar llamada a API
            console.log('Fetching modifiers...');
        } catch (error) {
            showToast('Error al cargar modificadores', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTables();
        fetchProducts();
        fetchModifiers();
    }, []);

    return {
        isLoading,
        users,
        tables,
        products,
        modifiers,
        fetchUsers,
        fetchTables,
        fetchProducts,
        fetchModifiers,
    };
};