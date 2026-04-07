import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getMenu, getProductsByCategory } from '../services/menuService';
import { Product } from '../types/product';

export const useMenu = (category?: string) => {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();

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