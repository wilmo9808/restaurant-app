import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getToppings } from '../services/adminService';

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export const useToppings = () => {
    const { token } = useAuthStore();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['toppings'],
        queryFn: () => {
            if (!token) throw new Error('No autenticado');
            return getToppings(token);
        },
        enabled: !!token,
    });

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