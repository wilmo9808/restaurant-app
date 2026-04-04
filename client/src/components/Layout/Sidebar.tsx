import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FileText, ChefHat, Coins, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const { user } = useAuthStore();

    const navItems = [
        { path: '/waiter', label: 'Tomar Pedido', icon: <FileText size={20} />, role: 'WAITER' },
        { path: '/kitchen', label: 'Cocina', icon: <ChefHat size={20} />, role: 'CHEF' },
        { path: '/cashier', label: 'Caja', icon: <Coins size={20} />, role: 'CASHIER' },
        { path: '/admin', label: 'Administración', icon: <Settings size={20} />, role: 'SUPER_ADMIN' },
    ];

    const filteredNavItems = navItems.filter(item => item.role === user?.role);

    return (
        <aside className="fixed left-0 top-[60px] h-[calc(100vh-60px)] w-64 bg-white shadow-md z-30">
            <nav className="py-4">
                {filteredNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};