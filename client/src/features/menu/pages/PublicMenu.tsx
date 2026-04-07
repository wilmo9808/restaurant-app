import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Utensils, Coffee, Beef, Pizza, Cake, Wine, Martini, Beer, Coffee as CoffeeIcon, Soup, Menu as MenuIcon } from 'lucide-react';
import { CategorySection } from '../components/CategorySection';
import { Product } from '../../../types/product';

interface CategoryGroup {
    name: string;
    products: Product[];
    icon: React.ReactNode;
}

export const PublicMenu: React.FC = () => {
    const { tableId } = useParams<{ tableId?: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState('RestoApp');

    useEffect(() => {
        fetchMenu();
        fetchRestaurantName();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/public/menu');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                setError('Error al cargar el menú');
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
            setError('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRestaurantName = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/public/settings/restaurant_name');
            const data = await response.json();
            if (data.success && data.data) {
                setRestaurantName(data.data);
            }
        } catch (error) {
            console.error('Error fetching restaurant name:', error);
        }
    };

    // Agrupar productos por categoría
    const categories = [...new Set(products.map(p => p.category))];
    const groupedProducts: CategoryGroup[] = categories.map(cat => ({
        name: cat,
        products: products.filter(p => p.category === cat),
        icon: null, // Iconos se manejan en otro lado o se omiten en este diseño
    }));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC107] mx-auto"></div>
                    <p className="mt-4 text-[#FFC107] tracking-widest uppercase text-sm">Cargando menú...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p className="text-xl mb-4">⚠️ {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-[#FFC107] text-[#FFC107] uppercase tracking-widest hover:bg-[#FFC107] hover:text-black transition-colors rounded-sm text-sm"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 overflow-x-hidden font-sans">
            {/* Header Tipo Barra de Navegación Plana */}
            <div className="bg-[#0a0a0a] text-white py-6 px-6 flex items-center justify-between border-b border-zinc-900 sticky top-0 z-50">
                <button className="text-gray-400 hover:text-[#FFC107] transition-colors">
                    <MenuIcon size={28} />
                </button>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-[200px]">
                    <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-[#FFC107] uppercase truncate">
                        MENU
                    </h1>
                </div>

                <div className="text-gray-500 font-bold text-xs tracking-widest flex gap-4">
                    <span className="hover:text-white cursor-pointer transition-colors">ES</span>
                </div>
            </div>

            {/* Aviso de Mesa si existe */}
            {
                tableId && (
                    <div className="text-center py-2 bg-[#FFC107]/10 text-[#FFC107] text-xs font-bold tracking-[0.3em] uppercase border-b border-[#FFC107]/20 backdrop-blur-sm sticky top-[77px] z-40">
                        MESA #{tableId}
                    </div>
                )
            }

            {/* Sub-header decorativo o espacio */}
            <div className="py-12"></div>

            {/* Menú (Categorías Verticales -> Carruseles Horizontales) */}
            <div className="max-w-[100vw] mx-auto pb-16">
                {groupedProducts.map((category) => (
                    <CategorySection
                        key={category.name}
                        name={category.name}
                        products={category.products}
                    />
                ))}

                {groupedProducts.length === 0 && (
                    <div className="text-center py-24 text-zinc-700">
                        <Utensils size={64} className="mx-auto mb-6 opacity-20" />
                        <p className="uppercase tracking-widest text-sm">El menú está vacío por ahora</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-[#050505] border-t border-zinc-900 text-zinc-600 py-12 px-6 text-center text-xs tracking-widest uppercase">
                <p className="mb-2">© {new Date().getFullYear()} ORDENAYA</p>
                <p className="opacity-50">Todos los derechos reservados</p>
            </div>

            {/* Background Texture/Noise Overlay Optional */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div >
    );
};