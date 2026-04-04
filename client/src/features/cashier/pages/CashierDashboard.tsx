import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { OrderList } from '../components/OrderList';
import { TotalSummary } from '../components/TotalSummary';
import { DailyReport } from '../components/DailyReport';
import { PaymentModal } from '../components/PaymentModal';
import { useOrders } from '../../../hooks/useOrders';
import { useUIStore } from '../../../store/uiStore';
import { Order } from '../../../types/order';
import { getTotals, getDailyReport as getDailyReportService } from '../../../services/orderService';
import { useAuthStore } from '../../../store/authStore';

type TabType = 'orders' | 'report';

export const CashierDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [totals, setTotals] = useState<any>(null);
    const [dailyReport, setDailyReport] = useState<any>(null);
    const [currentReportDate, setCurrentReportDate] = useState<string>('');

    const { orders, isLoading, updateStatus, isUpdating } = useOrders('READY');
    const { token } = useAuthStore();
    const { showToast } = useUIStore();

    useEffect(() => {
        loadTotals();
        loadDailyReport();
    }, []);

    const loadTotals = async () => {
        if (!token) return;
        try {
            const data = await getTotals(token);
            setTotals(data);
        } catch (error) {
            console.error('Error loading totals:', error);
        }
    };

    const loadDailyReport = async (date?: string) => {
        if (!token) return;
        try {
            // Si se pasa una fecha, agregarla como parámetro
            let url = '/reports/daily';
            if (date) {
                url = `/reports/daily?date=${date}`;
                setCurrentReportDate(date);
            } else {
                setCurrentReportDate('');
            }
            const data = await getDailyReportService(token, date);
            setDailyReport(data);
        } catch (error) {
            console.error('Error loading daily report:', error);
        }
    };

    const handleLoadDate = async (date: string) => {
        await loadDailyReport(date);
    };

    const refreshData = async () => {
        await Promise.all([loadTotals(), loadDailyReport(currentReportDate || undefined)]);
    };

    const handleProcessPayment = (order: Order) => {
        console.log('💰 Procesando pago para pedido:', order.id.slice(-6));
        setSelectedOrder(order);
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (selectedOrder) {
            console.log('✅ Confirmando pago para pedido:', selectedOrder.id.slice(-6));
            console.log('📤 Enviando status: COMPLETED');

            try {
                await updateStatus({ id: selectedOrder.id, status: 'COMPLETED' });
                console.log('✅ Pago procesado exitosamente');
                showToast('Pago procesado exitosamente', 'success');
                setIsPaymentModalOpen(false);
                setSelectedOrder(null);
                await refreshData();
            } catch (error) {
                console.error('❌ Error al procesar pago:', error);
                showToast('Error al procesar pago', 'error');
            }
        }
    };

    const tabs = [
        { id: 'orders' as TabType, label: 'Pedidos para Cobrar', count: orders.length },
        { id: 'report' as TabType, label: 'Reporte del Día' },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Caja</h1>
                    {totals && (
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total del día</div>
                            <div className="text-xl font-bold text-green-600">
                                ${totals.todayRevenue?.toLocaleString() || 0}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-2 font-medium transition-all
                                ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'orders' && (
                    <>
                        <TotalSummary totals={totals} />
                        <OrderList
                            orders={orders}
                            onProcessPayment={handleProcessPayment}
                            isLoading={isLoading || isUpdating}
                        />
                    </>
                )}

                {activeTab === 'report' && (
                    <DailyReport
                        report={dailyReport}
                        onRefresh={refreshData}
                        onLoadDate={handleLoadDate}
                    />
                )}

                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    order={selectedOrder}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onConfirm={handleConfirmPayment}
                />
            </div>
        </MainLayout>
    );
};