import { supabase } from '../config/supabase';
import { Product } from '../types/product';

export const getMenu = async (token: string): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('isActive', true)
        .is('deletedAt', null)
        .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);

    return data as Product[];
};

export const getProductsByCategory = async (token: string, category: string): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('category', category)
        .eq('isActive', true)
        .is('deletedAt', null);

    if (error) throw new Error(error.message);

    return data as Product[];
};

export const getProductById = async (token: string, id: string): Promise<Product> => {
    const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);

    return data as Product;
};