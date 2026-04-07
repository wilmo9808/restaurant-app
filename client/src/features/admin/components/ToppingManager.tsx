import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/Forms/Input';

interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ToppingManager: React.FC = () => {
    const { token } = useAuthStore();
    const { showToast, setLoading, isLoading } = useUIStore();
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        isActive: true,
    });

    const fetchToppings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/toppings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setToppings(data.data);
            }
        } catch (error) {
            console.error('Error fetching toppings:', error);
            showToast('Error al cargar toppings', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchToppings();
        }
    }, [token]);

    const handleOpenModal = (topping?: Topping) => {
        if (topping) {
            setEditingTopping(topping);
            setFormData({
                name: topping.name,
                price: topping.price,
                isActive: topping.isActive,
            });
        } else {
            setEditingTopping(null);
            setFormData({
                name: '',
                price: 0,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showToast('El nombre del topping es requerido', 'error');
            return;
        }
        if (formData.price < 0) {
            showToast('El precio no puede ser negativo', 'error');
            return;
        }

        setLoading(true);
        try {
            const url = editingTopping
                ? `${API_URL}/admin/toppings/${editingTopping.id}`
                : `${API_URL}/admin/toppings`;
            const method = editingTopping ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (data.success) {
                showToast(editingTopping ? 'Topping actualizado' : 'Topping creado', 'success');
                setIsModalOpen(false);
                fetchToppings();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error saving topping:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (topping: Topping) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/toppings/${topping.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...topping, isActive: !topping.isActive }),
            });
            const data = await response.json();
            if (data.success) {
                showToast('Estado actualizado', 'success');
                fetchToppings();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error toggling topping:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (toppingId: string) => {
        if (!confirm('¿Eliminar este topping? Se eliminará de todos los pedidos existentes.')) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/toppings/${toppingId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                showToast('Topping eliminado', 'success');
                fetchToppings();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            console.error('Error deleting topping:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const activeToppings = toppings.filter(t => t.isActive);
    const inactiveToppings = toppings.filter(t => !t.isActive);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Gestión de Toppings Globales</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Activos: {activeToppings.length} | Inactivos: {inactiveToppings.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Estos toppings se pueden agregar a CUALQUIER producto del menú.
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()}>+ Nuevo Topping</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topping</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {toppings.map((topping) => (
                            <tr key={topping.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{topping.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{formatPrice(topping.price)}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleToggleActive(topping)}
                                        className={`px-2 py-1 rounded-full text-xs ${topping.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {topping.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(topping)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(topping.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toppings.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-400">
                    <p>No hay salsas ni toppings creados</p>
                    <p className="text-sm">Haz clic en "+ Nuevo" para agregar</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTopping ? 'Editar Topping' : 'Nuevo Topping'}
                showConfirm
                confirmText="Guardar"
                onConfirm={handleSubmit}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <Input
                        label="Nombre del Topping"
                        placeholder="Ej: Queso extra, Tocineta, Guacamole"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Precio adicional"
                        type="number"
                        min={0}
                        step={500}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        fullWidth
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Topping activo</span>
                    </label>
                </div>
            </Modal>
        </div>
    );
};