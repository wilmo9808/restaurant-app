import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Product } from '../types/product';

interface PublicMenuState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    restaurantName: string;
}

export const usePublicMenu = () => {
    const [state, setState] = useState<PublicMenuState>({
        products: [],
        isLoading: true,
        error: null,
        restaurantName: 'RestoApp',
    });

    const fetchMenu = async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Obtener productos activos desde Supabase
            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('isActive', true)
                .is('deletedAt', null)
                .order('createdAt', { ascending: false });

            if (error) throw error;

            setState(prev => ({
                ...prev,
                products: data as Product[],
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error fetching menu:', error);
            setState(prev => ({
                ...prev,
                error: 'Error de conexión',
                isLoading: false,
            }));
        }
    };

    const fetchRestaurantName = async () => {
        try {
            const { data, error } = await supabase
                .from('Setting')
                .select('value')
                .eq('key', 'restaurant_name')
                .single();

            if (error) throw error;

            if (data && data.value) {
                setState(prev => ({ ...prev, restaurantName: data.value }));
            }
        } catch (error) {
            console.error('Error fetching restaurant name:', error);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchRestaurantName();
    }, []);

    const refetch = () => {
        fetchMenu();
    };

    return {
        ...state,
        refetch,
    };
};