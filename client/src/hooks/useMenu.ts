import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { getMenu, getProductsByCategory } from '../services/menuService';
import { Product } from '../types/product';
import { useSocket } from './useSocket';

export const useMenu = (category?: string) => {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['menu', category],
        queryFn: () => {
            if (!token) throw new Error('No autenticado');
            if (category) {
                return getProductsByCategory(token, category);
            }
            return getMenu(token);
        },
        enabled: !!token,
    });

    // Suscribirse a eventos de actualización del menú
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleMenuUpdated = (data: { action: string; product?: Product; productId?: string }) => {
            console.log('Menú actualizado:', data);
            // Refrescar la consulta del menú
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            refetch();
        };

        socket.on('menu-updated', handleMenuUpdated);

        return () => {
            socket.off('menu-updated', handleMenuUpdated);
        };
    }, [socket, isConnected, queryClient, refetch]);

    const getProductById = (id: string): Product | undefined => {
        return data?.find((product) => product.id === id);
    };

    const getProductsByCategoryName = (categoryName: string): Product[] => {
        return data?.filter((product) => product.category === categoryName) || [];
    };

    return {
        menu: data || [],
        isLoading,
        error,
        refetch,
        getProductById,
        getProductsByCategoryName,
    };
};