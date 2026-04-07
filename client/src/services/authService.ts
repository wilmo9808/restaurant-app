import { supabase } from '../config/supabase';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/user';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // 1. Iniciar sesión con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) throw new Error(error.message);

    if (!data.user) throw new Error('Usuario no encontrado');

    // 2. Obtener datos del usuario desde la tabla "User"
    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id, email, name, role, isActive, createdAt')
        .eq('id', data.user.id)
        .maybeSingle();

    if (userError) throw new Error(userError.message);

    if (!userData) throw new Error('Usuario no encontrado en la base de datos');

    return {
        user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            isActive: userData.isActive,
            createdAt: new Date(userData.createdAt),
        },
        token: data.session?.access_token || '',
    };
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // 1. Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: { name: credentials.name },
        },
    });

    if (error) throw new Error(error.message);

    if (!data.user) throw new Error('Error al crear usuario');

    // 2. Crear registro en la tabla "User"
    const { error: insertError } = await supabase.from('User').insert([
        {
            id: data.user.id,
            email: credentials.email,
            name: credentials.name,
            role: credentials.role || 'WAITER',
            isActive: true,
        },
    ]);

    if (insertError) throw new Error(insertError.message);

    return {
        user: {
            id: data.user.id,
            email: credentials.email,
            name: credentials.name,
            role: credentials.role || 'WAITER',
            isActive: true,
            createdAt: new Date(),
        },
        token: data.session?.access_token || '',
    };
};

export const getProfile = async (token: string): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) throw new Error(error?.message || 'Usuario no encontrado');

    const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id, email, name, role, isActive, createdAt')
        .eq('id', user.id)
        .maybeSingle();

    if (userError) throw new Error(userError.message);

    if (!userData) throw new Error('Usuario no encontrado en la base de datos');

    return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isActive: userData.isActive,
        createdAt: new Date(userData.createdAt),
    };
};

export const checkFirstAdmin = async (): Promise<{ hasAdmin: boolean }> => {
    const { data, error } = await supabase
        .from('User')
        .select('id')
        .eq('role', 'SUPER_ADMIN')
        .limit(1);

    if (error) throw new Error(error.message);

    return { hasAdmin: data && data.length > 0 };
};

export const registerFirstAdmin = async (data: { name: string; email: string; password: string }): Promise<User> => {
    // 1. Registrar en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: { name: data.name },
        },
    });

    if (authError) throw new Error(authError.message);

    if (!authData.user) throw new Error('Error al crear administrador');

    // 2. Crear registro en la tabla "User" con rol SUPER_ADMIN
    const { error: insertError } = await supabase.from('User').insert([
        {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    ]);

    if (insertError) throw new Error(insertError.message);

    return {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: 'SUPER_ADMIN',
        isActive: true,
        createdAt: new Date(),
    };
};

export const saveToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const saveUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const removeUser = (): void => {
    localStorage.removeItem('user');
};

export const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    removeToken();
    removeUser();
};