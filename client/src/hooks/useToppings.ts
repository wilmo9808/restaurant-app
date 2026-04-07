import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getToppings } from '../services/adminService';
import { useSocket } from './useSocket';

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export const useToppings = () => {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['toppings'],
        queryFn: () => {
            if (!token) throw new Error('No autenticado');
            return getToppings(token);
        },
        enabled: !!token,
    });

    // Suscribirse a eventos de actualización del menú (que incluye toppings)
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleMenuUpdated = () => {
            console.log('Toppings actualizados, recargando...');
            queryClient.invalidateQueries({ queryKey: ['toppings'] });
            refetch();
        };

        socket.on('menu-updated', handleMenuUpdated);

        return () => {
            socket.off('menu-updated', handleMenuUpdated);
        };
    }, [socket, isConnected, queryClient, refetch]);

    const getActiveToppings = (): Topping[] => {
        return data?.filter(topping => topping.isActive) || [];
    };

    const getToppingById = (id: string): Topping | undefined => {
        return data?.find(topping => topping.id === id);
    };

    const getToppingsByNames = (names: string[]): Topping[] => {
        if (!data) return [];
        return data.filter(topping => names.includes(topping.name));
    };

    return {
        toppings: data || [],
        activeToppings: getActiveToppings(),
        isLoading,
        error,
        refetch,
        getToppingById,
        getToppingsByNames,
    };
};