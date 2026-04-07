import React, { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useUIStore } from '../../../store/uiStore';
import { Button } from '../../../components/UI/Button';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/Forms/Input';
import { Select } from '../../../components/Forms/Select';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export const UserManager: React.FC = () => {
    const { showToast, setLoading, isLoading } = useUIStore();
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'WAITER',
        isActive: true,
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('User')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setUsers(data as User[]);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                name: user.name,
                password: '',
                role: user.role,
                isActive: user.isActive,
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                name: '',
                password: '',
                role: 'WAITER',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editingUser) {
                // Actualizar usuario existente
                const updateData: any = {
                    name: formData.name,
                    role: formData.role,
                    isActive: formData.isActive,
                };

                // Solo actualizar email si cambió
                if (formData.email !== editingUser.email) {
                    updateData.email = formData.email;
                }

                const { error } = await supabase
                    .from('User')
                    .update(updateData)
                    .eq('id', editingUser.id);

                if (error) throw error;

                // Si se proporcionó contraseña, actualizar en auth.users
                if (formData.password) {
                    const { error: authError } = await supabase.auth.admin.updateUserById(
                        editingUser.id,
                        { password: formData.password }
                    );
                    if (authError) throw authError;
                }
            } else {
                // Crear nuevo usuario
                // Primero crear en auth.users
                const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                    email: formData.email,
                    password: formData.password,
                    email_confirm: true,
                    user_metadata: { name: formData.name },
                });

                if (authError) throw authError;

                // Actualizar rol en la tabla User
                const { error: updateError } = await supabase
                    .from('User')
                    .update({ role: formData.role })
                    .eq('id', authData.user.id);

                if (updateError) throw updateError;
            }

            showToast(editingUser ? 'Usuario actualizado' : 'Usuario creado', 'success');
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (user: User) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('User')
                .update({ isActive: !user.isActive })
                .eq('id', user.id);

            if (error) throw error;

            showToast('Estado actualizado', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Error toggling user:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('¿Eliminar este usuario?')) return;

        setLoading(true);
        try {
            // Eliminar de auth.users (esto eliminará también de User por cascada)
            const { error } = await supabase.auth.admin.deleteUser(userId);
            if (error) throw error;

            showToast('Usuario eliminado', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'WAITER', label: 'Mesero' },
        { value: 'CHEF', label: 'Chef' },
        { value: 'CASHIER', label: 'Cajero' },
    ];

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'WAITER': return 'Mesero';
            case 'CHEF': return 'Chef';
            case 'CASHIER': return 'Cajero';
            case 'SUPER_ADMIN': return 'Administrador';
            default: return role;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Usuarios del Sistema</h2>
                <Button onClick={() => handleOpenModal()}>+ Nuevo Usuario</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'SUPER_ADMIN'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <button
                                        onClick={() => handleToggleActive(user)}
                                        className={`px-2 py-1 rounded-full text-xs ${user.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {user.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Editar
                                    </button>
                                    {user.role !== 'SUPER_ADMIN' && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                showConfirm
                confirmText="Guardar"
                onConfirm={handleSubmit}
                isLoading={isLoading}
            >
                <div className="space-y-4">
                    <Input
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder={editingUser ? 'Dejar en blanco para no cambiar' : ''}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        fullWidth
                    />
                    <Select
                        label="Rol"
                        options={roleOptions}
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        fullWidth
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">Usuario activo</span>
                    </label>
                </div>
            </Modal>
        </div>
    );
};