import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/Forms/Input';

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    baseUrl: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, baseUrl }) => {
    const [includeTable, setIncludeTable] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [qrValue, setQrValue] = useState(baseUrl);

    useEffect(() => {
        if (includeTable && tableNumber) {
            setQrValue(`${baseUrl}/${tableNumber}`);
        } else {
            setQrValue(baseUrl);
        }
    }, [includeTable, tableNumber, baseUrl]);

    const copyToClipboard = () => {
        navigator.clipboard.writeLink(qrValue);
        alert('Enlace copiado al portapapeles');
    };

    const downloadQR = () => {
        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `menu_qr${includeTable ? `_mesa_${tableNumber}` : ''}.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Compartir Menú por QR"
            showConfirm={false}
        >
            <div className="space-y-6">
                <p className="text-sm text-gray-600">
                    Escanea este código QR desde tu celular para ver el menú del restaurante.
                </p>

                <div className="flex justify-center py-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <QRCodeSVG
                            id="qr-code"
                            value={qrValue}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <label className="flex items-center gap-2 mb-3">
                        <input
                            type="checkbox"
                            checked={includeTable}
                            onChange={(e) => setIncludeTable(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Incluir número de mesa</span>
                    </label>

                    {includeTable && (
                        <Input
                            type="number"
                            placeholder="Número de mesa"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            min={1}
                            className="mt-2"
                        />
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="secondary"
                        onClick={copyToClipboard}
                        className="flex-1"
                    >
                        Copiar enlace
                    </Button>
                    <Button
                        variant="primary"
                        onClick={downloadQR}
                        className="flex-1"
                    >
                        Descargar QR
                    </Button>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                    <p>El QR enlaza a: <span className="font-mono break-all">{qrValue}</span></p>
                </div>
            </div>
        </Modal>
    );
};