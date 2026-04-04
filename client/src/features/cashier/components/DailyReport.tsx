import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/Forms/Input';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Calendar, Search, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface DailyReportProps {
    report: {
        date?: Date | string;
        totalOrders?: number;
        totalRevenue?: number;
        completedOrders?: number;
        pendingOrders?: number;
        ordersByTable?: Record<number, number>;
        orders?: any[];
    } | null;
    onRefresh?: () => void;
    onLoadDate?: (date: string) => void;
}

export const DailyReport: React.FC<DailyReportProps> = ({ report, onRefresh, onLoadDate }) => {
    const { token } = useAuthStore();
    const { showToast, setLoading, isLoading } = useUIStore();
    const [isExporting, setIsExporting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [displayDate, setDisplayDate] = useState<string>(selectedDate);

    // Función para ajustar la fecha a UTC-5 (Colombia)
    const adjustDateToColombia = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-');
        // Crear fecha en UTC-5 (Colombia)
        const colombiaDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 5, 0, 0));
        return colombiaDate.toISOString().split('T')[0];
    };

    // Cargar el reporte de la fecha actual al montar el componente
    useEffect(() => {
        if (onLoadDate && selectedDate) {
            const adjustedDate = adjustDateToColombia(selectedDate);
            onLoadDate(adjustedDate);
            setDisplayDate(selectedDate);
        }
    }, []);

    const handleLoadDate = () => {
        if (onLoadDate) {
            const adjustedDate = adjustDateToColombia(selectedDate);
            onLoadDate(adjustedDate);
            setDisplayDate(selectedDate);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const adjustedDate = adjustDateToColombia(selectedDate);
            const dateParam = `?date=${adjustedDate}`;

            const response = await fetch(`http://localhost:3000/api/reports/export-excel${dateParam}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al exportar');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const fileName = `reporte_${selectedDate}.xlsx`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('Reporte exportado exitosamente', 'success');
        } catch (error) {
            console.error('Error exportando:', error);
            showToast('Error al exportar reporte', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    if (!report) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const totalRevenue = report.totalRevenue || 0;
    const totalOrders = report.totalOrders || 0;
    const completedOrders = report.completedOrders || 0;
    const pendingOrders = report.pendingOrders || 0;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const stats = [
        { label: 'Total Ventas', value: formatCurrency(totalRevenue), color: 'text-green-600' },
        { label: 'Total Pedidos', value: totalOrders, color: 'text-blue-600' },
        { label: 'Ticket Promedio', value: formatCurrency(averageTicket), color: 'text-purple-600' },
        { label: 'Pedidos Completados', value: completedOrders, color: 'text-green-500' },
        { label: 'Pedidos Pendientes', value: pendingOrders, color: 'text-yellow-500' },
    ];

    // Formatear la fecha seleccionada para mostrar
    const formatDisplayDate = () => {
        if (!displayDate) return 'Día';
        const [year, month, day] = displayDate.split('-');
        return formatDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4">
                {/* Selector de fecha */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar size={18} /> Seleccionar Fecha
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="flex-1"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={handleLoadDate}
                                isLoading={isLoading}
                            >
                                <span className="flex items-center gap-2"><Search size={16} /> Ver Reporte</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="success"
                                onClick={handleExportExcel}
                                isLoading={isExporting}
                            >
                                <span className="flex items-center gap-2"><FileSpreadsheet size={16} /> Exportar a Excel</span>
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Selecciona una fecha para ver el reporte y exportar a Excel
                    </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Reporte del {formatDisplayDate()}
                    </h2>
                    <div className="flex gap-2">
                        {onRefresh && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={onRefresh}
                                isLoading={isLoading}
                            >
                                <span className="flex items-center gap-2"><RefreshCw size={16} /> Actualizar</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {report.ordersByTable && Object.keys(report.ordersByTable).length > 0 && (
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Ventas por Mesa</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
                            {Object.entries(report.ordersByTable).map(([table, total]) => (
                                <div key={table} className="bg-blue-50 rounded-lg p-2 text-center">
                                    <div className="text-xs text-gray-500">Mesa {table}</div>
                                    <div className="text-sm font-bold text-blue-600">{formatCurrency(total as number)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {report.orders && report.orders.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-3">Últimos Pedidos</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {report.orders.slice(0, 10).map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                        <span className="font-mono text-sm">#{order.id?.slice(-6)}</span>
                                        <span className="ml-2 text-xs text-gray-500">Mesa {order.tableNumber}</span>
                                    </div>
                                    <div className="text-sm font-medium">{formatCurrency(order.total)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};