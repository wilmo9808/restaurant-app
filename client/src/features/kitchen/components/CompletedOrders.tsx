import React from 'react';
import { Order } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Button } from '../../../components/UI/Button';

interface CompletedOrdersProps {
    orders: Order[];
    onMarkCompleted: (orderId: string) => void;
    isUpdating?: boolean;
}

export const CompletedOrders: React.FC<CompletedOrdersProps> = ({
    orders,
    onMarkCompleted,
    isUpdating,
}) => {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-center py-12 text-gray-400">
                    <p>No hay pedidos completados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Pedidos Listos para Servir</h2>
            <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">#{order.id.slice(-6)}</span>
                                <span className="text-sm text-gray-600">Mesa {order.tableNumber}</span>
                                <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                                {order.items.length} productos • {formatCurrency(order.total)}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => onMarkCompleted(order.id)}
                            isLoading={isUpdating}
                        >
                            Marcar Entregado
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};