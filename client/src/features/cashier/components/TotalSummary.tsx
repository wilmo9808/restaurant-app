import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

interface TotalSummaryProps {
    totals: {
        todayRevenue?: number;
        totalRevenue?: number;
        totalOrders?: number;
        pendingOrders?: number;
        inProgressOrders?: number;
    } | null;
}

export const TotalSummary: React.FC<TotalSummaryProps> = ({ totals }) => {
    if (!totals) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const summaryCards = [
        { label: 'Ventas Hoy', value: formatCurrency(totals.todayRevenue || 0), color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Ventas Totales', value: formatCurrency(totals.totalRevenue || 0), color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pedidos Totales', value: totals.totalOrders || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pedidos Pendientes', value: totals.pendingOrders || 0, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'En Preparación', value: totals.inProgressOrders || 0, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {summaryCards.map((card, index) => (
                <div key={index} className={`${card.bg} rounded-lg shadow-md p-4`}>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
            ))}
        </div>
    );
};