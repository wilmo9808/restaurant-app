import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { TableSelector } from '../components/TableSelector';
import { MenuGrid } from '../components/MenuGrid';
import { OrderSummary } from '../components/OrderSummary';
import { useOrderStore } from '../../../store/orderStore';
import { useMenu } from '../../../hooks/useMenu';
import { useAuthStore } from '../../../store/authStore';
import { OrderItemInput } from '../../../types/order';
import { Button } from '../../../components/UI/Button';
import { useUIStore } from '../../../store/uiStore';

export const WaiterDashboard: React.FC = () => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const { currentOrder, clearCurrentOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity } = useOrderStore();
    const { menu, isLoading: menuLoading } = useMenu();
    const { user } = useAuthStore();
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
            modifications: toppings || [],
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
            // Obtener el usuario autenticado
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                throw new Error('Usuario no autenticado');
            }

            // Calcular el total correctamente (producto + toppings)
            const itemsWithTotal = currentOrder.items.map(item => {
                const toppingsTotal = (item.modifications || []).reduce((sum: number, t: any) => sum + t.price, 0);
                const itemTotal = (item.price + toppingsTotal) * item.quantity;
                return { ...item, itemTotal };
            });

            const totalOrder = itemsWithTotal.reduce((sum, item) => sum + item.itemTotal, 0);

            // Crear la orden en Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('Order')
                .insert([{
                    tableNumber: selectedTable,
                    total: totalOrder,
                    notes: notes || '',
                    userId: authUser.id,
                    status: 'PENDING',
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // Crear los items de la orden
            const orderItems = currentOrder.items.map(item => {
                const toppingsTotal = (item.modifications || []).reduce((sum: number, t: any) => sum + t.price, 0);
                const subtotal = (item.price + toppingsTotal) * item.quantity;

                return {
                    orderId: orderData.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: subtotal,
                    toppings: item.modifications ? JSON.stringify(item.modifications) : null,
                };
            });

            const { error: itemsError } = await supabase
                .from('OrderItem')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            showToast(notes ? 'Pedido con notas enviado a cocina' : 'Pedido enviado a cocina', 'success');
            clearCurrentOrder();
            setSelectedTable(null);
        } catch (error) {
            console.error('Error al enviar pedido:', error);
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