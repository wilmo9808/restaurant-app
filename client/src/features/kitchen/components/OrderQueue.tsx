import React from 'react';
import { OrderTicket } from './OrderTicket';
import { Order } from '../../../types/order';

interface OrderQueueProps {
    orders: Order[];
    title: string;
    emptyMessage: string;
    onStartOrder?: (orderId: string) => void;
    onCompleteOrder?: (orderId: string) => void;
    isUpdating?: boolean;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({
    orders,
    title,
    emptyMessage,
    onStartOrder,
    onCompleteOrder,
    isUpdating,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {orders.map((order) => (
                        <OrderTicket
                            key={order.id}
                            order={order}
                            onStartOrder={onStartOrder}
                            onCompleteOrder={onCompleteOrder}
                            isUpdating={isUpdating}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};