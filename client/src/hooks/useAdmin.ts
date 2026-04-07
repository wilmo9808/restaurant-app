import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { getUsers, getTables, getProducts, getToppings } from '../services/adminService';

// Tipos
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

interface Topping {
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

    // Toppings
    const [toppings, setToppings] = useState<Topping[]>([]);

    const fetchUsers = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getUsers(token);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Error al cargar usuarios', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTables = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getTables(token);
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
            showToast('Error al cargar mesas', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getProducts(token);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Error al cargar productos', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchToppings = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await getToppings(token);
            setToppings(data);
        } catch (error) {
            console.error('Error fetching toppings:', error);
            showToast('Error al cargar toppings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchTables();
            fetchProducts();
            fetchToppings();
        }
    }, [token]);

    return {
        isLoading,
        users,
        tables,
        products,
        toppings,
        fetchUsers,
        fetchTables,
        fetchProducts,
        fetchToppings,
    };
};