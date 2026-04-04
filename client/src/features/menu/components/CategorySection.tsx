import React, { useRef } from 'react';
import { Product } from '../../../types/product';
import { PublicMenuCard } from './PublicMenuCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
    name: string;
    products: Product[];
    icon?: React.ReactNode;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ name, products, icon }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (products.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth > 768 ? 600 : 300;
            const currentScroll = scrollRef.current.scrollLeft;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-24 relative group">
            {/* Título de la Categoría */}
            <div className="flex items-center gap-6 mb-12 max-w-5xl mx-auto px-6 relative z-10">
                <div className="h-[1px] flex-grow bg-gradient-to-l from-[#FFC107]/40 to-transparent"></div>
                <h2 className="text-2xl md:text-3xl font-black text-[#FFC107] uppercase tracking-[0.25em] text-center shadow-black drop-shadow-lg flex flex-col items-center gap-4">
                    {name}
                </h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[#FFC107]/40 to-transparent"></div>
            </div>

            {/* Contenedor del Carrusel con Botones */}
            <div className="relative mx-auto flex items-center max-w-[1400px]">
                {/* Botón Izquierda */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 md:left-2 z-20 bg-black/60 hover:bg-[#FFC107] text-[#FFC107] hover:text-black p-2 md:p-3 rounded-full border border-[#FFC107]/50 backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 md:group-hover:opacity-100 hidden md:flex items-center justify-center -translate-y-12"
                    aria-label="Anterior"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Carrusel Horizontal de Productos */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-8 px-8 md:px-16 w-full scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <PublicMenuCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Botón Derecha */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 md:right-2 z-20 bg-black/60 hover:bg-[#FFC107] text-[#FFC107] hover:text-black p-2 md:p-3 rounded-full border border-[#FFC107]/50 backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 md:group-hover:opacity-100 hidden md:flex items-center justify-center -translate-y-12"
                    aria-label="Siguiente"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};