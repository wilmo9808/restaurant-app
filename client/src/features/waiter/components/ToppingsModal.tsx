import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/UI/Modal';
import { supabase } from '../../../config/supabase';
import { useUIStore } from '../../../store/uiStore';
import { Product } from '../../../types/product';
import { formatCurrency } from '../../../utils/formatters';

interface Topping {
    id: string;
    name: string;
    price: number;
    isActive: boolean;
}

interface ToppingsModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onConfirm: (toppings: { toppingId: string; toppingName: string; price: number }[]) => void;
}

export const ToppingsModal: React.FC<ToppingsModalProps> = ({
    isOpen,
    product,
    onClose,
    onConfirm,
}) => {
    const { showToast } = useUIStore();
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
    const [isLoadingToppings, setIsLoadingToppings] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchToppings();
        }
    }, [isOpen]);

    const fetchToppings = async () => {
        setIsLoadingToppings(true);
        try {
            const { data, error } = await supabase
                .from('Topping')
                .select('*')
                .eq('isActive', true)
                .order('name', { ascending: true });

            if (error) throw error;

            setToppings(data as Topping[]);
        } catch (error) {
            console.error('Error al cargar toppings:', error);
            showToast('Error al cargar toppings', 'error');
        } finally {
            setIsLoadingToppings(false);
        }
    };

    const toggleTopping = (topping: Topping) => {
        setSelectedToppings((prev) => {
            const exists = prev.find((t) => t.id === topping.id);
            if (exists) {
                return prev.filter((t) => t.id !== topping.id);
            } else {
                return [...prev, topping];
            }
        });
    };

    const handleConfirm = () => {
        const toppingsToAdd = selectedToppings.map((topping) => ({
            toppingId: topping.id,
            toppingName: topping.name,
            price: topping.price,
        }));
        onConfirm(toppingsToAdd);
        setSelectedToppings([]);
    };

    const handleClose = () => {
        setSelectedToppings([]);
        onClose();
    };

    const totalExtra = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const basePrice = product?.price || 0;
    const totalPrice = basePrice + totalExtra;

    if (!product) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Agregar Toppings a: ${product.name}`}
            showConfirm
            confirmText="Agregar al pedido"
            onConfirm={handleConfirm}
        >
            <div className="space-y-4">
                <div className="pb-3 border-b border-gray-100">
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                        Base: {formatCurrency(basePrice)}
                    </p>
                </div>

                {isLoadingToppings ? (
                    <div className="text-center py-4">
                        <div className="text-gray-500">Cargando toppings...</div>
                    </div>
                ) : toppings.length === 0 ? (
                    <div className="text-center py-4 text-yellow-600">
                        <p>No hay toppings disponibles</p>
                        <p className="text-sm">Contacta al administrador</p>
                    </div>
                ) : (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Toppings disponibles:</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {toppings.map((topping) => (
                                <label
                                    key={topping.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedToppings.some((t) => t.id === topping.id)}
                                            onChange={() => toggleTopping(topping)}
                                            className="w-4 h-4 text-blue-600 rounded"
                                        />
                                        <span className="text-gray-700">{topping.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {topping.price > 0 ? `+${formatCurrency(topping.price)}` : 'Gratis'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {totalExtra > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between font-semibold">
                            <span>Total con toppings:</span>
                            <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};