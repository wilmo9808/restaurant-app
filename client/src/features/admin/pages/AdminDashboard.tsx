import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { useAuthStore } from '../../../store/authStore';
import { UserManager } from '../components/UserManager';
import { TableManager } from '../components/TableManager';
import { ProductManager } from '../components/ProductManager';
import { ToppingManager } from '../components/ToppingManager';
import { CategoryManager } from '../components/CategoryManager';
import { QRModal } from '../../menu/components/QRModal';
import { Button } from '../../../components/UI/Button';
import { Smartphone } from 'lucide-react';
import { useSocket } from '../../../hooks/useSocket';

type AdminTab = 'users' | 'tables' | 'products' | 'toppings' | 'categories';

export const AdminDashboard: React.FC = () => {
    useSocket(); // Inicializa la conexión socket para el Admin
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const { user } = useAuthStore();

    const baseUrl = `${window.location.protocol}//${window.location.host}/menu`;

    const tabs = [
        { id: 'users' as AdminTab, label: 'Usuarios', description: 'Gestionar meseros, chefs y cajeros' },
        { id: 'tables' as AdminTab, label: 'Mesas', description: 'Configurar número de mesas' },
        { id: 'products' as AdminTab, label: 'Productos', description: 'Agregar, editar o eliminar productos' },
        { id: 'toppings' as AdminTab, label: 'Toppings', description: 'Gestionar toppings globales (queso, tocineta, etc.)' },
        { id: 'categories' as AdminTab, label: 'Categorías', description: 'Agregar, editar o eliminar categorías' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManager />;
            case 'tables':
                return <TableManager />;
            case 'products':
                return <ProductManager />;
            case 'toppings':
                return <ToppingManager />;
            case 'categories':
                return <CategoryManager />;
            default:
                return null;
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Bienvenido, {user?.name}. Aquí puedes gestionar toda la configuración del restaurante.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setIsQRModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Smartphone size={18} />
                        Compartir Menú
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                p-4 rounded-lg text-left transition-all border-2
                                ${activeTab === tab.id
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className="text-2xl mb-1">{tab.label.split(' ')[0]}</div>
                            <div className="font-medium text-gray-800">{tab.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {renderContent()}
                </div>
            </div>

            <QRModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                baseUrl={baseUrl}
            />
        </MainLayout>
    );
};