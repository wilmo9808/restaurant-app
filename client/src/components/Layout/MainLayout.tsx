import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};