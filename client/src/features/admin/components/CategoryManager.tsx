import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/Forms/Input';
import { Lightbulb } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    isActive: boolean;
    productCount: number;
}

export const CategoryManager: React.FC = () => {
    const { showToast, setLoading, isLoading } = useUIStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [products, setProducts] = useState<any[]>([]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('Product')
                .select('category')
                .is('deletedAt', null);

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const loadCategories = () => {
        // Obtener categorías únicas de los productos (solo las que tienen productos)
        const uniqueCategories = [...new Set(products.map(p => p.category))];

        const categoriesWithCount = uniqueCategories.map(catName => ({
            id: catName.toLowerCase().replace(/\s/g, '_'),
            name: catName,
            isActive: true,
            productCount: products.filter(p => p.category === catName).length,
        }));

        setCategories(categoriesWithCount);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            loadCategories();
        }
    }, [products]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            showToast('Ingrese un nombre para la categoría', 'error');
            return;
        }

        // Verificar si ya existe
        if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
            showToast('La categoría ya existe', 'error');
            return;
        }

        setLoading(true);
        try {
            // Crear un producto temporal para crear la categoría
            const { error } = await supabase
                .from('Product')
                .insert([{
                    name: `Temporal - ${newCategoryName}`,
                    price: 0,
                    category: newCategoryName,
                    description: `Categoría creada: ${newCategoryName}`,
                    isActive: false,
                }]);

            if (error) throw error;

            showToast(`Categoría "${newCategoryName}" creada exitosamente`, 'success');
            setNewCategoryName('');
            setIsModalOpen(false);
            await fetchProducts();
        } catch (error) {
            console.error('Error creating category:', error);
            showToast('Error de conexión al crear categoría', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Categorías</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total: {categories.length} categorías
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ Nueva Categoría</Button>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg">
                    <p>No hay categorías con productos</p>
                    <p className="text-sm mt-2">Crea un producto para que aparezca su categoría</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="font-medium text-gray-800 text-sm">{category.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-yellow-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <Lightbulb size={18} />
                    Sugerencia
                </h3>
                <p className="text-sm text-yellow-700">
                    Las categorías se crean automáticamente al agregar productos.
                    Puedes crear una nueva categoría aquí y luego asignarla a un producto.
                </p>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Categoría"
                showConfirm
                confirmText="Crear Categoría"
                onConfirm={handleAddCategory}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <Input
                        label="Nombre de la Categoría"
                        placeholder="Ej: Ensaladas, Pizzas, etc."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        fullWidth
                    />
                    <div className="text-sm text-gray-500">
                        <p>Al crear una categoría, se creará un producto temporal que podrás editar después.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};