import { useAuthStore } from '../../../store/authStore';

export const useAuth = () => {
    const { user, token, isLoading, error, login, logout, hasRole } = useAuthStore();

    return {
        user,
        token,
        isLoading,
        error,
        login,
        logout,
        hasRole,
        isAuthenticated: !!token && !!user,
        isWaiter: user?.role === 'WAITER',
        isChef: user?.role === 'CHEF',
        isCashier: user?.role === 'CASHIER',
    };
};