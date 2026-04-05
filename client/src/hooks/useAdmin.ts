import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useUIStore } from '../../../store/uiStore';

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
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('User')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setUsers(data as User[]);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Error al cargar usuarios', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTables = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('Table')
                .select('*')
                .order('number', { ascending: true });

            if (error) throw error;
            setTables(data as Table[]);
        } catch (error) {
            console.error('Error fetching tables:', error);
            showToast('Error al cargar mesas', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .is('deletedAt', null)
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setProducts(data as Product[]);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Error al cargar productos', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchToppings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('Topping')
                .select('*')
                .eq('isActive', true)
                .order('name', { ascending: true });

            if (error) throw error;
            setToppings(data as Topping[]);
        } catch (error) {
            console.error('Error fetching toppings:', error);
            showToast('Error al cargar toppings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTables();
        fetchProducts();
        fetchToppings();
    }, []);

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