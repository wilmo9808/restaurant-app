import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { OrderQueue } from '../components/OrderQueue';
import { useOrders } from '../../../hooks/useOrders';
import { useUIStore } from '../../../store/uiStore';

type TabType = 'pending' | 'in-progress' | 'ready';

export const KitchenDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const { orders, isLoading, updateStatus, isUpdating } = useOrders();
    const { showToast } = useUIStore();

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const inProgressOrders = orders.filter(o => o.status === 'IN_PROGRESS');
    const readyOrders = orders.filter(o => o.status === 'READY');

    const handleStartOrder = (orderId: string) => {
        updateStatus({ id: orderId, status: 'IN_PROGRESS' });
        showToast('Pedido iniciado', 'info');
    };

    const handleCompleteOrder = async (orderId: string) => {
        await updateStatus({ id: orderId, status: 'READY' });
        showToast('Pedido listo para servir', 'success');
    };

    const tabs = [
        { id: 'pending' as TabType, label: 'Pendientes', count: pendingOrders.length, color: 'bg-yellow-500' },
        { id: 'in-progress' as TabType, label: 'En Preparación', count: inProgressOrders.length, color: 'bg-blue-500' },
        { id: 'ready' as TabType, label: 'Listos para Servir', count: readyOrders.length, color: 'bg-green-500' },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Cocina</h1>
                    <div className="text-sm text-gray-500">
                        {isLoading ? 'Cargando...' : `${orders.length} pedidos totales`}
                    </div>
                </div>

                <div className="flex gap-2 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-2 font-medium transition-all relative
                                ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full text-white ${tab.color}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'pending' && (
                    <OrderQueue
                        orders={pendingOrders}
                        title="Pedidos Pendientes"
                        emptyMessage="No hay pedidos pendientes"
                        onStartOrder={handleStartOrder}
                        isUpdating={isUpdating}
                    />
                )}

                {activeTab === 'in-progress' && (
                    <OrderQueue
                        orders={inProgressOrders}
                        title="Pedidos en Preparación"
                        emptyMessage="No hay pedidos en preparación"
                        onCompleteOrder={handleCompleteOrder}
                        isUpdating={isUpdating}
                    />
                )}

                {activeTab === 'ready' && (
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Pedidos Listos para Servir</h2>
                        {readyOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p>No hay pedidos listos para servir</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {readyOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-4 bg-green-50 rounded-lg border border-green-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-lg font-bold text-gray-800">
                                                    Pedido #{order.id.slice(-6)}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    Mesa {order.tableNumber}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400">
                                                    por {order.userName}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1 mb-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <span className="font-medium">{item.quantity}x</span>
                                                    <span className="ml-2 text-gray-700">{item.productName}</span>
                                                    {item.modifications && item.modifications.length > 0 && (
                                                        <div className="ml-6 text-xs text-gray-500">
                                                            {item.modifications.map((mod, i) => (
                                                                <span key={i} className="mr-2">• {mod.modifierName}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};