import React, { useState } from 'react';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/Forms/Input';
import { Modal } from '../../../components/UI/Modal';
import { formatCurrency } from '../../../utils/formatters';
import { CurrentOrder } from '../../../store/orderStore';

interface OrderSummaryProps {
    order: CurrentOrder | null;
    tableNumber: number | null;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onSendOrder: (notes?: string) => void;
    isLoading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    order,
    tableNumber,
    onUpdateQuantity,
    onRemoveItem,
    onSendOrder,
    isLoading,
}) => {
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [notes, setNotes] = useState('');

    const hasItems = order && order.items.length > 0;

    const handleSendWithNotes = () => {
        setIsNotesModalOpen(true);
    };

    const handleConfirmSend = () => {
        onSendOrder(notes);
        setIsNotesModalOpen(false);
        setNotes('');
    };

    const handleSendWithoutNotes = () => {
        onSendOrder('');
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Pedido {tableNumber ? `- Mesa ${tableNumber}` : ''}
                </h2>

                {!hasItems ? (
                    <div className="text-center py-8 text-gray-400">
                        <p>No hay productos agregados</p>
                        <p className="text-sm">Selecciona productos del menú</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {order.items.map((item) => (
                                <div key={item.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 text-sm">{item.productName}</p>
                                        <p className="text-xs text-gray-500">{formatCurrency(item.price)}</p>
                                        {item.modifications && item.modifications.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.modifications.map((mod, idx) => (
                                                    <span key={idx} className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                                                        {mod.modifierName}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                            className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                                            className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => onRemoveItem(item.productId)}
                                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 mt-4 pt-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    onClick={handleSendWithoutNotes}
                                    isLoading={isLoading}
                                    variant="primary"
                                    className="flex-1"
                                >
                                    Enviar Pedido
                                </Button>
                                <Button
                                    onClick={handleSendWithNotes}
                                    isLoading={isLoading}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    + Notas
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Modal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                title="Agregar Notas al Pedido"
                showConfirm
                confirmText="Enviar con Notas"
                onConfirm={handleConfirmSend}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Agrega instrucciones especiales para la cocina (ej: sin sal, bien cocido, etc.)
                    </p>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Sin sal, bien cocido, entregar con papas..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                    <div className="text-xs text-gray-400">
                        Las notas aparecerán en la cocina junto al pedido.
                    </div>
                </div>
            </Modal>
        </>
    );
};