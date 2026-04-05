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
                                src={product.imageUrl}
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