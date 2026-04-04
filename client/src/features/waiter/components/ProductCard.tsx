import React from 'react';
import { Product } from '../../../types/product';
import { formatCurrency } from '../../../utils/formatters';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const hasModifiers = product.modifiers && product.modifiers.length > 0;

    return (
        <button
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-3 text-left hover:shadow-md transition-shadow hover:border-blue-300"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formatCurrency(product.price)}</p>
                </div>
                {hasModifiers && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Personalizable
                    </span>
                )}
            </div>
            {product.description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{product.description}</p>
            )}
        </button>
    );
};