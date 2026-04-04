import React from 'react';
import { Order, OrderStatus } from '../../../types/order';
import { formatTime } from '../../../utils/formatters';
import { Button } from '../../../components/UI/Button';

interface OrderTicketProps {
    order: Order;
    onStartOrder?: (orderId: string) => void;
    onCompleteOrder?: (orderId: string) => void;
    isUpdating?: boolean;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({
    order,
    onStartOrder,
    onCompleteOrder,
    isUpdating,
}) => {
    const statusColors: Record<OrderStatus, string> = {
        PENDING: 'border-yellow-500 bg-yellow-50',
        IN_PROGRESS: 'border-blue-500 bg-blue-50',
        READY: 'border-green-500 bg-green-50',
        COMPLETED: 'border-gray-500 bg-gray-50',
    };

    const getStatusText = (status: OrderStatus): string => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'IN_PROGRESS': return 'En preparación';
            case 'READY': return 'Listo para servir';
            case 'COMPLETED': return 'Completado';
            default: return status;
        }
    };

    return (
        <div className={`border-l-4 ${statusColors[order.status]} bg-white rounded-lg shadow-sm p-4`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-lg font-bold text-gray-800">Pedido #{order.id.slice(-6)}</span>
                    <span className="ml-2 text-sm text-gray-500">Mesa {order.tableNumber}</span>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">{formatTime(order.createdAt)}</div>
                    <div className="text-xs text-gray-400">por {order.userName}</div>
                </div>
            </div>

            <div className="space-y-1 mb-3">
                {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="ml-2 text-gray-700">{item.productName}</span>
                        {item.modifications && item.modifications.length > 0 && (
                            <div className="ml-6 text-sm text-gray-600 font-medium">
                                {item.modifications.map((mod, i) => (
                                    <span key={i} className="mr-2">• {mod.modifierName}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {order.notes && order.notes.trim() !== '' && (
                <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="text-xs font-semibold text-yellow-700 uppercase mb-1">📝 Notas del mesero:</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</div>
                </div>
            )}

            <div className="flex justify-end items-center pt-2 border-t border-gray-100 mt-2">
                <div className="flex gap-2">
                    {order.status === 'PENDING' && onStartOrder && (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onStartOrder(order.id)}
                            isLoading={isUpdating}
                        >
                            Iniciar
                        </Button>
                    )}
                    {order.status === 'IN_PROGRESS' && onCompleteOrder && (
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => onCompleteOrder(order.id)}
                            isLoading={isUpdating}
                        >
                            Completar
                        </Button>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full self-center ${statusColors[order.status]} text-gray-700`}>
                        {getStatusText(order.status)}
                    </span>
                </div>
            </div>
        </div>
    );
};