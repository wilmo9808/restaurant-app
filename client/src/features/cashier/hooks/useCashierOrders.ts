import { useState, useEffect } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { useSocket } from '../../../hooks/useSocket';
import { useUIStore } from '../../../store/uiStore';
import { getTotals, getDailyReport } from '../../../services/orderService';
import { useAuthStore } from '../../../store/authStore';
import { Order, TotalsData, DailyReport as DailyReportType } from '../../../types/order';

export const useCashierOrders = () => {
    const { orders, isLoading, updateStatus, isUpdating } = useOrders('READY');
    const { token } = useAuthStore();
    const { showToast } = useUIStore();
    const [totals, setTotals] = useState<TotalsData | null>(null);
    const [dailyReport, setDailyReport] = useState<DailyReportType | null>(null);
    const [isLoadingTotals, setIsLoadingTotals] = useState(false);

    const readyOrders = orders.filter(o => o.status === 'READY');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');

    const loadTotals = async () => {
        if (!token) return;
        setIsLoadingTotals(true);
        try {
            const data = await getTotals(token);
            setTotals(data);
        } catch (error) {
            console.error('Error loading totals:', error);
        } finally {
            setIsLoadingTotals(false);
        }
    };

    const loadDailyReport = async () => {
        if (!token) return;
        try {
            const data = await getDailyReport(token);
            setDailyReport(data);
        } catch (error) {
            console.error('Error loading daily report:', error);
        }
    };

    const processPayment = async (orderId: string) => {
        await updateStatus({ id: orderId, status: 'COMPLETED' });
        showToast('Pago procesado exitosamente', 'success');
        await loadTotals();
        await loadDailyReport();
    };

    useEffect(() => {
        loadTotals();
        loadDailyReport();
    }, []);

    return {
        orders,
        readyOrders,
        completedOrders,
        isLoading,
        isUpdating,
        isLoadingTotals,
        totals,
        dailyReport,
        processPayment,
        loadTotals,
        loadDailyReport,
    };
};