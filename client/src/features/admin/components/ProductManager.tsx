import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/Forms/Input';
import { Select } from '../../../components/Forms/Select';
import { ImagePlus, X, Archive, RotateCcw, Trash2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description?: string;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt: string;
}

export const ProductManager: React.FC = () => {
    const { token } = useAuthStore();
    const { showToast, setLoading, isLoading } = useUIStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        category: '',
        description: '',
        isActive: true,
        imageUrl: null as string | null,
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/admin/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
                const uniqueCategories = [...new Set(data.data.map((p: Product) => p.category))];
                setCategories(uniqueCategories.map(cat => ({ value: cat, label: cat })));
            }
        } catch (error) {
            showToast('Error al cargar productos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description || '',
                isActive: product.isActive,
                imageUrl: product.imageUrl || null,
            });
            setImagePreview(product.imageUrl ? `http://localhost:3000${product.imageUrl}` : null);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: 0,
                category: categories.length > 0 ? categories[0].value : '',
                description: '',
                isActive: true,
                imageUrl: null,
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, imageUrl: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return formData.imageUrl;

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', imageFile);

            const response = await fetch('http://localhost:3000/api/admin/products/upload-image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.imageUrl;
            } else {
                showToast('Error al subir imagen', 'error');
                return null;
            }
        } catch (error) {
            showToast('Error al subir imagen', 'error');
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showToast('El nombre es requerido', 'error');
            return;
        }
        if (formData.price <= 0) {
            showToast('El precio debe ser mayor a 0', 'error');
            return;
        }
        if (!formData.category) {
            showToast('Seleccione una categoría', 'error');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = formData.imageUrl;

            if (imageFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            }

            const submitData = {
                ...formData,
                imageUrl,
            };

            const url = editingProduct
                ? `http://localhost:3000/api/admin/products/${editingProduct.id}`
                : 'http://localhost:3000/api/admin/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (data.success) {
                showToast(editingProduct ? 'Producto actualizado' : 'Producto creado', 'success');
                setIsModalOpen(false);
                fetchProducts();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (product: Product) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...product, isActive: !product.isActive }),
            });

            const data = await response.json();

            if (data.success) {
                showToast('Estado actualizado', 'success');
                fetchProducts();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async (productId: string, productName: string) => {
        if (!confirm(`¿Archivar "${productName}"? El producto dejará de aparecer en el menú pero los reportes históricos se conservan.`)) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/admin/products/${productId}/archive`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                showToast('Producto archivado exitosamente', 'success');
                fetchProducts();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePermanent = async (productId: string, productName: string) => {
        if (!confirm(`¿Eliminar PERMANENTEMENTE "${productName}"? Esta acción no se puede deshacer. Solo es posible si el producto no tiene pedidos asociados.`)) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                showToast('Producto eliminado permanentemente', 'success');
                fetchProducts();
            } else {
                showToast(data.message || 'Error', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const activeProducts = products.filter(p => p.isActive);
    const inactiveProducts = products.filter(p => !p.isActive);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Gestión de Productos</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Activos: {activeProducts.length} | Inactivos: {inactiveProducts.length}
                    </p>
                </div>
                <Button onClick={() => handleOpenModal()}>+ Nuevo Producto</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    {product.imageUrl ? (
                                        <img
                                            src={`http://localhost:3000${product.imageUrl}`}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">Sin</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        {product.description && (
                                            <div className="text-xs text-gray-500">{product.description}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{product.category}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(product.price)}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleToggleActive(product)}
                                        className={`px-2 py-1 rounded-full text-xs ${product.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {product.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Editar"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleArchive(product.id, product.name)}
                                        className="text-yellow-600 hover:text-yellow-800"
                                        title="Archivar (ocultar del menú)"
                                    >
                                        <Archive size={16} className="inline mr-1" />
                                        Archivar
                                    </button>
                                    <button
                                        onClick={() => handleDeletePermanent(product.id, product.name)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar permanentemente (solo si no tiene pedidos)"
                                    >
                                        <Trash2 size={16} className="inline mr-1" />
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                showConfirm
                confirmText="Guardar"
                onConfirm={handleSubmit}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                                >
                                    <ImagePlus size={24} className="text-gray-400" />
                                    <span className="text-xs text-gray-400">Subir</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500">Formatos: JPG, PNG, WEBP (máx 5MB)</p>
                        </div>
                    </div>

                    <Input
                        label="Nombre del Producto"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Precio"
                        type="number"
                        min={0}
                        step={100}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        fullWidth
                    />
                    <Select
                        label="Categoría"
                        options={categories}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Descripción (opcional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Producto activo</span>
                    </label>
                </div>
            </Modal>
        </div>
    );
};