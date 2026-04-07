import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/Forms/Input';
import { Pen, Trash2, Lightbulb } from 'lucide-react';

interface Table {
    id: number;
    number: number;
    isActive: boolean;
}

export const TableManager: React.FC = () => {
    const { showToast, setLoading, isLoading } = useUIStore();
    const [tables, setTables] = useState<Table[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const [formData, setFormData] = useState({
        number: 1,
        isActive: true,
    });

    const fetchTables = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Table')
                .select('*')
                .order('number', { ascending: true });

            if (error) throw error;
            setTables(data as Table[]);
        } catch (error) {
            console.error('Error fetching tables:', error);
            showToast('Error al cargar mesas', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleOpenModal = (table?: Table) => {
        if (table) {
            setEditingTable(table);
            setFormData({
                number: table.number,
                isActive: table.isActive,
            });
        } else {
            setEditingTable(null);
            setFormData({
                number: tables.length + 1,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.number || formData.number < 1) {
            showToast('El número de mesa debe ser mayor a 0', 'error');
            return;
        }

        setLoading(true);
        try {
            let error;
            if (editingTable) {
                const { error: updateError } = await supabase
                    .from('Table')
                    .update({
                        number: formData.number,
                        isActive: formData.isActive,
                    })
                    .eq('id', editingTable.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('Table')
                    .insert([{
                        number: formData.number,
                        isActive: formData.isActive,
                    }]);
                error = insertError;
            }

            if (error) throw error;

            showToast(editingTable ? 'Mesa actualizada' : 'Mesa creada', 'success');
            setIsModalOpen(false);
            fetchTables();
        } catch (error) {
            console.error('Error saving table:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (table: Table) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('Table')
                .update({ isActive: !table.isActive })
                .eq('id', table.id);

            if (error) throw error;

            showToast('Estado actualizado', 'success');
            fetchTables();
        } catch (error) {
            console.error('Error toggling table:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (tableId: number) => {
        if (!confirm('¿Eliminar esta mesa?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('Table')
                .delete()
                .eq('id', tableId);

            if (error) throw error;

            showToast('Mesa eliminada', 'success');
            fetchTables();
        } catch (error) {
            console.error('Error deleting table:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const activeTables = tables.filter(t => t.isActive);
    const inactiveTables = tables.filter(t => !t.isActive);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Configuración de Mesas</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mesas activas: {activeTables.length} | Inactivas: {inactiveTables.length}
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()}>+ Nueva Mesa</Button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-6">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`
                            relative p-3 rounded-lg text-center border-2 transition-all
                            ${table.isActive
                                ? 'bg-green-50 border-green-300 hover:shadow-md'
                                : 'bg-gray-100 border-gray-200 opacity-60'
                            }
                        `}
                    >
                        <div className="text-lg font-bold text-gray-700">Mesa {table.number}</div>
                        <div className="text-xs mt-1">
                            {table.isActive ? (
                                <span className="text-green-600">Activa</span>
                            ) : (
                                <span className="text-gray-500">Inactiva</span>
                            )}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-0.5">
                            <button
                                onClick={() => handleOpenModal(table)}
                                className="text-black-500 hover:text-black-700 p-0.5"
                                title="Editar"
                            >
                                <Pen size={13} />
                            </button>
                            <button
                                onClick={() => handleDelete(table.id)}
                                className="text-black-500 hover:text-black-700 p-0.5"
                                title="Eliminar"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <Lightbulb size={18} />
                    Sugerencia
                </h3>
                <p className="text-sm text-yellow-700">
                    Las mesas inactivas no aparecerán en la selección del mesero.
                    Puedes desactivar mesas temporalmente sin eliminarlas.
                </p>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTable ? 'Editar Mesa' : 'Nueva Mesa'}
                showConfirm
                confirmText="Guardar"
                onConfirm={handleSubmit}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <Input
                        label="Número de Mesa"
                        type="number"
                        min={1}
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                        fullWidth
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Mesa activa</span>
                    </label>
                </div>
            </Modal>
        </div>
    );
};