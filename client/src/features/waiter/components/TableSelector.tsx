import React from 'react';
import { useUIStore } from '../../../store/uiStore';
import { useTablesRealtime } from '../../../hooks/useTablesRealtime';

interface TableSelectorProps {
    selectedTable: number | null;
    onSelectTable: (tableNumber: number) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({ selectedTable, onSelectTable }) => {
    const { showToast } = useUIStore();
    const { tables, isLoading, error } = useTablesRealtime();

    React.useEffect(() => {
        if (!isLoading) {
            console.log(`🖥️ [UI RENDER] TableSelector reactualizado con ${tables.length} mesas.`);
        }
    }, [tables, isLoading]);

    // Mostrar error si existe
    if (error) {
        showToast(error, 'error');
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Seleccionar Mesa</h2>
                <div className="flex justify-center py-4">
                    <div className="text-gray-500">Cargando mesas...</div>
                </div>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Seleccionar Mesa</h2>
                <div className="text-center py-4 text-yellow-600">
                    No hay mesas activas. Contacta al administrador.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Seleccionar Mesa</h2>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-15 gap-2">
                {tables.map((table) => (
                    <button
                        key={table.id}
                        onClick={() => onSelectTable(table.number)}
                        className={`
                            py-2 rounded-lg font-medium transition-all
                            ${selectedTable === table.number
                                ? 'bg-blue-600 text-white shadow-md scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        Mesa {table.number}
                    </button>
                ))}
            </div>
        </div>
    );
};