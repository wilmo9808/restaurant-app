import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { TableSelector } from '../components/TableSelector';
import { MenuGrid } from '../components/MenuGrid';
import { OrderSummary } from '../components/OrderSummary';
import { useOrderStore } from '../../../store/orderStore';
import { useMenu } from '../../../hooks/useMenu';
import { useSocket } from '../../../hooks/useSocket';
import { useAuthStore } from '../../../store/authStore';
import { OrderItemInput } from '../../../types/order';
import { Button } from '../../../components/UI/Button';
import { useUIStore } from '../../../store/uiStore';

export const WaiterDashboard: React.FC = () => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const { currentOrder, clearCurrentOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity } = useOrderStore();
    const { menu, isLoading: menuLoading } = useMenu();
    const { token, user } = useAuthStore();
    const { emit } = useSocket();
    const { showToast, setLoading, isLoading } = useUIStore();

    const handleSelectTable = (tableNumber: number) => {
        setSelectedTable(tableNumber);
        if (currentOrder) {
            clearCurrentOrder();
        }
    };

    const handleAddItem = (productId: string, productName: string, price: number, toppings?: any[]) => {
        addItemToOrder({
            productId,
            productName,
            quantity: 1,
            price,
            modifications: toppings || [], // Mantenemos "modifications" en el store por compatibilidad
        });
        if (toppings && toppings.length > 0) {
            showToast('Producto con toppings agregado', 'success');
        } else {
            showToast('Producto agregado', 'success');
        }
    };

    const handleSendOrder = async (notes?: string) => {
        if (!selectedTable) {
            showToast('Seleccione una mesa primero', 'error');
            return;
        }

        if (!currentOrder || currentOrder.items.length === 0) {
            showToast('Agregue productos al pedido', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    tableNumber: selectedTable,
                    items: currentOrder.items,
                    total: currentOrder.total,
                    notes: notes || '',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                emit('new-order', data.data);
                showToast(notes ? 'Pedido con notas enviado a cocina' : 'Pedido enviado a cocina', 'success');
                clearCurrentOrder();
                setSelectedTable(null);
            } else {
                showToast(data.message || 'Error al enviar pedido', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (menuLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Cargando menú...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Tomar Pedido</h1>
                    {user && (
                        <div className="text-sm text-gray-500">
                            Mesero: {user.name}
                        </div>
                    )}
                </div>

                <TableSelector
                    selectedTable={selectedTable}
                    onSelectTable={handleSelectTable}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <MenuGrid
                            products={menu}
                            onAddItem={handleAddItem}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <OrderSummary
                            order={currentOrder}
                            tableNumber={selectedTable}
                            onUpdateQuantity={updateItemQuantity}
                            onRemoveItem={removeItemFromOrder}
                            onSendOrder={handleSendOrder}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};