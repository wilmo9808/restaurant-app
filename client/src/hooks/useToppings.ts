import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

const getToppingsFromSupabase = async (): Promise<Topping[]> => {
    const { data, error } = await supabase
        .from('Topping')
        .select('*')
        .eq('isActive', true)
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Topping[];
};

export const useToppings = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['toppings'],
        queryFn: () => getToppingsFromSupabase(),
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