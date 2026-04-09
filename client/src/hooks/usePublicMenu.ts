import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useSocket } from './useSocket';

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
    const { socket, isConnected } = useSocket();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const fetchMenu = async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(`${API_URL}/public/menu`);
            const data = await response.json();

            if (data.success) {
                setState(prev => ({
                    ...prev,
                    products: data.data,
                    isLoading: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: 'Error al cargar el menú',
                    isLoading: false,
                }));
            }
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
            const response = await fetch(`${API_URL}/public/settings/restaurant_name`);
            const data = await response.json();

            if (data.success && data.data) {
                setState(prev => ({ ...prev, restaurantName: data.data }));
            }
        } catch (error) {
            console.error('Error fetching restaurant name:', error);
        }
    };

    // Suscripción a cambios en tiempo real
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleMenuUpdated = () => {
            console.log('🔄 Menú actualizado, recargando...');
            fetchMenu();
        };

        socket.on('menu-updated', handleMenuUpdated);

        return () => {
            socket.off('menu-updated', handleMenuUpdated);
        };
    }, [socket, isConnected]);

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