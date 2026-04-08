import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

export const useTablesRealtime = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTables = async () => {
        try {
            const { data, error } = await supabase
                .from('Table')
                .select('*')
                .eq('isActive', true)
                .order('number', { ascending: true });

            if (error) throw error;
            setTables(data || []);
        } catch (err: any) {
            console.error('Error fetching tables:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();

        // Suscripción a cambios en tiempo real
        const subscription = supabase
            .channel('tables-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'Table' },
                (payload) => {
                    console.log('Cambio en mesas:', payload);
                    fetchTables(); // Recargar mesas cuando haya cambios
                }
            )
            .subscribe((status, err) => {
                console.log('🔗 [SUPABASE REALTIME] Estado de suscripción a mesas:', status);
                if (err) console.error('🚫 [SUPABASE REALTIME] Error en suscripción:', err);
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { tables, isLoading, error, refetch: fetchTables };
};