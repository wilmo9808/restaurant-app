import React, { useState } from 'react';
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';
import { Order } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { DollarSign, CreditCard, Smartphone, Coffee } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    order,
    onClose,
    onConfirm,
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [receivedAmount, setReceivedAmount] = useState<number>(order?.total || 0);

    if (!order) return null;

    const change = receivedAmount - order.total;
    const hasChange = paymentMethod === 'cash' && receivedAmount > order.total;

    const handleConfirm = () => {
        onConfirm();
        setPaymentMethod('cash');
        setReceivedAmount(order.total);
    };

    const handleClose = () => {
        onClose();
        setPaymentMethod('cash');
        setReceivedAmount(order.total);
    };

    // Calcular subtotales
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const toppingsTotal = order.items.reduce((sum, item) => {
        const itemToppingsTotal = item.modifications?.reduce((tSum, mod) => tSum + mod.price, 0) || 0;
        return sum + (itemToppingsTotal * item.quantity);
    }, 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Procesar Pago"
            showConfirm
            confirmText="Confirmar Pago"
            onConfirm={handleConfirm}
        >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Cabecera del pedido */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pedido #</span>
                        <span className="font-medium">{order.id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Mesa</span>
                        <span className="font-medium">{order.tableNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Fecha</span>
                        <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    {order.notes && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                            <span className="font-semibold text-yellow-700">Notas:</span>
                            <p className="text-gray-600 mt-1">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Detalle de productos */}
                <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Detalle del pedido:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {order.items.map((item, idx) => {
                            const itemToppingsTotal = item.modifications?.reduce((sum, mod) => sum + mod.price, 0) || 0;
                            const itemTotal = (item.price + itemToppingsTotal) * item.quantity;

                            return (
                                <div key={idx} className="bg-gray-50 rounded-lg p-2">
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-medium">{item.quantity}x</span>
                                            <span className="ml-2 text-gray-800">{item.productName}</span>
                                        </div>
                                        <span className="font-medium">{formatCurrency(itemTotal)}</span>
                                    </div>
                                    {item.modifications && item.modifications.length > 0 && (
                                        <div className="ml-6 mt-1 text-xs text-gray-500">
                                            {item.modifications.map((mod, i) => (
                                                <div key={i} className="flex justify-between">
                                                    <span>• {mod.modifierName}</span>
                                                    <span>{formatCurrency(mod.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {item.price > 0 && (
                                        <div className="ml-6 text-xs text-gray-400">
                                            Precio base: {formatCurrency(item.price)} c/u
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Resumen de totales */}
                <div className="border-t border-gray-200 pt-3">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal productos:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {toppingsTotal > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Toppings:</span>
                                <span>{formatCurrency(toppingsTotal)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                            <span>Total a pagar:</span>
                            <span className="text-blue-600">{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Método de pago */}
                <div className="border-t border-gray-200 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`
                                flex-1 py-2 px-3 rounded-lg border text-center transition-all
                                ${paymentMethod === 'cash'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <DollarSign size={20} className="mx-auto" />
                            <div className="text-xs mt-1">Efectivo</div>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`
                                flex-1 py-2 px-3 rounded-lg border text-center transition-all
                                ${paymentMethod === 'card'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <CreditCard size={20} className="mx-auto" />
                            <div className="text-xs mt-1">Tarjeta</div>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('transfer')}
                            className={`
                                flex-1 py-2 px-3 rounded-lg border text-center transition-all
                                ${paymentMethod === 'transfer'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            <Smartphone size={20} className="mx-auto" />
                            <div className="text-xs mt-1">Transferencia</div>
                        </button>
                    </div>
                </div>

                {/* Campo para efectivo */}
                {paymentMethod === 'cash' && (
                    <div className="border-t border-gray-200 pt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recibo (Efectivo)
                        </label>
                        <input
                            type="number"
                            value={receivedAmount}
                            onChange={(e) => setReceivedAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {hasChange && (
                            <div className="mt-2 text-sm text-green-600">
                                Cambio: {formatCurrency(change)}
                            </div>
                        )}
                        {receivedAmount < order.total && (
                            <div className="mt-2 text-sm text-red-600">
                                Falta: {formatCurrency(order.total - receivedAmount)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};