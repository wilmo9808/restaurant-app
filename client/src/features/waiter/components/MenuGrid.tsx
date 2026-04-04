import React, { useState } from 'react';
import { Product } from '../../../types/product';
import { ProductCard } from './ProductCard';
import { ToppingsModal } from './ToppingsModal';

interface MenuGridProps {
    products: Product[];
    onAddItem: (productId: string, productName: string, price: number, toppings?: any[]) => void;
}

// Categorías que NO pueden tener toppings
const EXCLUDED_CATEGORIES = ['Bebidas', 'Postres'];

export const MenuGrid: React.FC<MenuGridProps> = ({ products, onAddItem }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = [...new Set(products.map(p => p.category))];
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    const canAddToppings = (product: Product): boolean => {
        return !EXCLUDED_CATEGORIES.includes(product.category);
    };

    const handleProductClick = (product: Product) => {
        if (canAddToppings(product)) {
            // Abrir modal de toppings solo para categorías permitidas
            setSelectedProduct(product);
            setIsModalOpen(true);
        } else {
            // Agregar directamente sin toppings
            onAddItem(product.id, product.name, product.price);
        }
    };

    const handleConfirmToppings = (toppings: any[]) => {
        if (selectedProduct) {
            onAddItem(
                selectedProduct.id,
                selectedProduct.name,
                selectedProduct.price,
                toppings
            );
        }
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                            px-4 py-2 rounded-lg whitespace-nowrap transition-all
                            ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                    />
                ))}
            </div>

            <ToppingsModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmToppings}
            />
        </div>
    );
};