import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../UI/Button';
import { Utensils } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'WAITER':
                return 'Mesero';
            case 'CHEF':
                return 'Chef';
            case 'CASHIER':
                return 'Cajero';
            case 'SUPER_ADMIN':
                return 'Admin';
            default:
                return role;
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                        <Utensils size={28} />
                        OrdenaYa
                    </div>
                    <div className="text-sm text-gray-500">Sistema de Pedidos</div>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <>
                            <div className="text-right">
                                <div className="font-medium text-gray-800">{user.name}</div>
                                <div className="text-xs text-gray-500">{getRoleLabel(user.role)}</div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={logout}>
                                Salir
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};