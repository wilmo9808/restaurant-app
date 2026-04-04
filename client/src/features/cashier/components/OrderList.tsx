import React from 'react';
import { Order } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Button } from '../../../components/UI/Button';

interface OrderListProps {
    orders: Order[];
    onProcessPayment: (order: Order) => void;
    isLoading?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onProcessPayment, isLoading }) => {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-center py-12 text-gray-400">
                    <p>No hay pedientes pendientes de cobro</p>
                </div>
            </div>
        );
    }

    const totalPending = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Pedidos para Cobrar</h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500">Total pendiente</div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(totalPending)}</div>
                </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-gray-800">#{order.id.slice(-6)}</span>
                                <span className="text-sm text-gray-600">Mesa {order.tableNumber}</span>
                                <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                                {order.items.length} productos • {formatCurrency(order.total)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Cliente: {order.userName}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => onProcessPayment(order)}
                            isLoading={isLoading}
                        >
                            Cobrar
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};