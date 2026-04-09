import React from 'react';
import { Product } from '../../../types/product';
import { formatCurrency } from '../../../utils/formatters';
import { Coffee, Beer, Wine, Martini, Cake, Pizza, Beef, Soup, Utensils } from 'lucide-react';

interface PublicMenuCardProps {
    product: Product;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función para obtener ícono por categoría (fallback cuando no hay imagen)
const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('bebida') || cat.includes('cerveza')) return <Beer size={32} className="text-gray-500" />;
    if (cat.includes('vino') || cat.includes('champan')) return <Wine size={32} className="text-gray-500" />;
    if (cat.includes('cóctel') || cat.includes('coctel')) return <Martini size={32} className="text-gray-500" />;
    if (cat.includes('postre')) return <Cake size={32} className="text-gray-500" />;
    if (cat.includes('hamburguesa')) return <Beef size={32} className="text-gray-500" />;
    if (cat.includes('perro')) return <Soup size={32} className="text-gray-500" />;
    if (cat.includes('pizza') || cat.includes('nachos')) return <Pizza size={32} className="text-gray-500" />;
    if (cat.includes('café') || cat.includes('te')) return <Coffee size={32} className="text-gray-500" />;
    return <Utensils size={32} className="text-gray-500" />;
};

export const PublicMenuCard: React.FC<PublicMenuCardProps> = ({ product }) => {
    const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
    // Construir URL de imagen usando el backend (Cloudinary)
    const baseUrl = API_URL.replace('/api', '');
    const imageUrl = hasImage ? `${baseUrl}${product.imageUrl}` : null;

    const cat = product.category.toLowerCase();
    const isDrink = cat.includes('bebida') || cat.includes('cerveza') || cat.includes('vino') || cat.includes('cóctel') || cat.includes('coctel');

    return (
        <div className="snap-center shrink-0 w-[240px] md:w-[280px] flex flex-col items-center group cursor-pointer">
            {/* Imagen del Producto (real o placeholder) */}
            {hasImage && imageUrl ? (
                // Imagen real subida por admin
                isDrink ? (
                    <div className="w-20 h-44 mb-8 shadow-2xl rounded-lg overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                console.error('Error loading image:', imageUrl);
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                ) : (
                    <div className="w-48 h-48 md:w-52 md:h-52 mb-8 shadow-2xl rounded-full overflow-hidden border-2 border-zinc-800">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                console.error('Error loading image:', imageUrl);
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )
            ) : (
                // Placeholder con ícono cuando no hay imagen
                isDrink ? (
                    <div className="w-20 h-44 bg-zinc-900 rounded-lg mb-8 shadow-2xl border border-zinc-800 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                        {getCategoryIcon(product.category)}
                    </div>
                ) : (
                    <div className="w-48 h-48 md:w-52 md:h-52 bg-zinc-900 rounded-full mb-8 shadow-2xl border-2 border-zinc-800 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                        {getCategoryIcon(product.category)}
                    </div>
                )
            )}

            <div className="text-center w-full px-2 flex flex-col items-center flex-grow">
                <h3 className="text-lg md:text-xl font-bold text-[#FFC107] uppercase tracking-wide mb-3 line-clamp-2 px-4 shadow-black drop-shadow-md">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-xs md:text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3 w-5/6 mx-auto">
                        {product.description.toLowerCase()}
                    </p>
                )}

                <span className="mt-auto text-xl md:text-2xl font-bold text-[#FFC107] tracking-widest whitespace-nowrap pt-2">
                    {formatCurrency(product.price)}
                </span>
            </div>
        </div>
    );
};