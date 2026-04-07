import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { socket, isConnected } = useSocket();

    const fetchTables = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/tables/active`);
            const data = await response.json();
            if (data.success) {
                setTables(data.data);
            } else {
                setError('Error al cargar mesas');
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            setError('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Suscribirse a eventos de actualización de mesas
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleTablesUpdated = () => {
            console.log('Mesas actualizadas, recargando...');
            fetchTables();
        };

        socket.on('tables-updated', handleTablesUpdated);

        return () => {
            socket.off('tables-updated', handleTablesUpdated);
        };
    }, [socket, isConnected]);

    return {
        tables,
        isLoading,
        error,
        refetch: fetchTables,
    };
};