import { create } from 'zustand';
import { User, Role } from '../types/user';
import { login as loginService, logout as logoutService, getToken, saveToken, removeToken, saveUser, getUser, removeUser, checkFirstAdmin } from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    initialize: () => void;
    hasRole: (role: Role) => boolean;
    checkAdminExists: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await loginService({ email, password });
            saveToken(response.token);
            saveUser(response.user);
            set({ user: response.user, token: response.token, isLoading: false });
            return true;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return false;
        }
    },

    logout: async () => {
        await logoutService();
        removeToken();
        removeUser();
        set({ user: null, token: null });
    },

    setUser: (user: User) => {
        saveUser(user);
        set({ user });
    },

    setToken: (token: string) => {
        saveToken(token);
        set({ token });
    },

    initialize: () => {
        const token = getToken();
        const user = getUser();
        if (token && user) {
            set({ token, user });
        }
    },

    hasRole: (role: Role) => {
        const { user } = get();
        return user?.role === role;
    },

    checkAdminExists: async () => {
        const result = await checkFirstAdmin();
        return result.hasAdmin;
    },
}));