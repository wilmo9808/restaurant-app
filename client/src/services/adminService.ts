import { supabase } from '../config/supabase';

// ==================== TIPOS ====================

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface UserCreateInput {
    email: string;
    name: string;
    password: string;
    role?: string;
    isActive?: boolean;
}

export interface UserUpdateInput {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
    isActive?: boolean;
}

export interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

export interface TableCreateInput {
    number: number;
    isActive?: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface ProductCreateInput {
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
}

export interface ProductUpdateInput {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
    imageUrl?: string | null;
    isActive?: boolean;
}

export interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

export interface ToppingCreateInput {
    name: string;
    price: number;
    isActive?: boolean;
}

export interface ToppingUpdateInput {
    name?: string;
    price?: number;
    isActive?: boolean;
}

// ==================== USUARIOS ====================

export const getUsers = async (token: string): Promise<User[]> => {
    const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);
    return data as User[];
};

export const createUser = async (token: string, data: UserCreateInput): Promise<User> => {
    // Primero crear el usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { name: data.name },
    });

    if (authError) throw new Error(authError.message);

    // Actualizar el rol en la tabla User
    const { data: userData, error: userError } = await supabase
        .from('User')
        .update({ role: data.role || 'WAITER' })
        .eq('id', authData.user.id)
        .select()
        .single();

    if (userError) throw new Error(userError.message);

    return userData as User;
};

export const updateUser = async (token: string, id: string, data: UserUpdateInput): Promise<User> => {
    const updateData: any = {};
    if (data.role) updateData.role = data.role;
    if (data.name) updateData.name = data.name;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const { data: userData, error } = await supabase
        .from('User')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return userData as User;
};

export const deleteUser = async (token: string, id: string): Promise<void> => {
    // Eliminar de auth.users (esto eliminará también de User por cascada)
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw new Error(error.message);
};

// ==================== MESAS ====================

export const getTables = async (token: string): Promise<Table[]> => {
    const { data, error } = await supabase
        .from('Table')
        .select('*')
        .order('number', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Table[];
};

export const createTable = async (token: string, data: TableCreateInput): Promise<Table> => {
    const { data: table, error } = await supabase
        .from('Table')
        .insert([{ number: data.number, isActive: data.isActive ?? true }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return table as Table;
};

export const updateTable = async (token: string, id: number, data: Partial<Table>): Promise<Table> => {
    const { data: table, error } = await supabase
        .from('Table')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return table as Table;
};

export const deleteTable = async (token: string, id: number): Promise<void> => {
    const { error } = await supabase
        .from('Table')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
};

// ==================== PRODUCTOS ====================

export const getProducts = async (token: string): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('Product')
        .select('*')
        .is('deletedAt', null)
        .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Product[];
};

export const createProduct = async (token: string, data: ProductCreateInput): Promise<Product> => {
    const { data: product, error } = await supabase
        .from('Product')
        .insert([{
            name: data.name,
            price: data.price,
            category: data.category,
            description: data.description,
            imageUrl: data.imageUrl,
            isActive: data.isActive ?? true,
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return product as Product;
};

export const updateProduct = async (token: string, id: string, data: ProductUpdateInput): Promise<Product> => {
    const { data: product, error } = await supabase
        .from('Product')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return product as Product;
};

export const deleteProduct = async (token: string, id: string): Promise<void> => {
    // Soft delete - solo marcar como eliminado
    const { error } = await supabase
        .from('Product')
        .update({ isActive: false, deletedAt: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(error.message);
};

export const uploadProductImage = async (token: string, file: File): Promise<{ imageUrl: string }> => {
    // Subir imagen a Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return { imageUrl: publicUrl };
};

// ==================== TOPPINGS ====================

export const getToppings = async (token: string): Promise<Topping[]> => {
    const { data, error } = await supabase
        .from('Topping')
        .select('*')
        .eq('isActive', true)
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Topping[];
};

export const createTopping = async (token: string, data: ToppingCreateInput): Promise<Topping> => {
    const { data: topping, error } = await supabase
        .from('Topping')
        .insert([{
            name: data.name,
            price: data.price,
            isActive: data.isActive ?? true,
        }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return topping as Topping;
};

export const updateTopping = async (token: string, id: string, data: ToppingUpdateInput): Promise<Topping> => {
    const { data: topping, error } = await supabase
        .from('Topping')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return topping as Topping;
};

export const deleteTopping = async (token: string, id: string): Promise<void> => {
    const { error } = await supabase
        .from('Topping')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
};