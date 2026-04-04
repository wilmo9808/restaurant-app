import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/Forms/Input';
import { Card, CardBody, CardHeader } from '../../../components/UI/Card';
import { Modal } from '../../../components/UI/Modal';
import { Utensils, UserPlus, TriangleAlert } from 'lucide-react';
import { checkFirstAdmin, registerFirstAdmin } from '../../../services/authService';
import { useUIStore } from '../../../store/uiStore';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [hasRedirected, setHasRedirected] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerErrors, setRegisterErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
    const [isRegistering, setIsRegistering] = useState(false);
    const [hasAdmin, setHasAdmin] = useState(true);

    const { login, user, isLoading, error } = useAuthStore();
    const { showToast } = useUIStore();
    const navigate = useNavigate();

    // Verificar si ya existe un administrador
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const result = await checkFirstAdmin();
                setHasAdmin(result.hasAdmin);
            } catch (error) {
                console.error('Error checking admin:', error);
            }
        };
        checkAdmin();
    }, []);

    useEffect(() => {
        if (user && !hasRedirected) {
            setHasRedirected(true);
            switch (user.role) {
                case 'WAITER':
                    navigate('/waiter');
                    break;
                case 'CHEF':
                    navigate('/kitchen');
                    break;
                case 'CASHIER':
                    navigate('/cashier');
                    break;
                case 'SUPER_ADMIN':
                    navigate('/admin');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [user, navigate, hasRedirected]);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'El email es requerido';
        } else if (!email.includes('@')) {
            newErrors.email = 'Email inválido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegisterForm = () => {
        const newErrors: { name?: string; email?: string; password?: string; confirm?: string } = {};

        if (!registerName.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        if (!registerEmail) {
            newErrors.email = 'El email es requerido';
        } else if (!registerEmail.includes('@')) {
            newErrors.email = 'Email inválido';
        }
        if (!registerPassword) {
            newErrors.password = 'La contraseña es requerida';
        } else if (registerPassword.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (registerPassword !== registerConfirmPassword) {
            newErrors.confirm = 'Las contraseñas no coinciden';
        }

        setRegisterErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        await login(email, password);
    };

    const handleRegister = async () => {
        if (!validateRegisterForm()) return;

        setIsRegistering(true);
        try {
            await registerFirstAdmin({
                name: registerName,
                email: registerEmail,
                password: registerPassword,
            });
            showToast('Administrador creado exitosamente. Ahora puedes iniciar sesión.', 'success');
            setIsRegisterModalOpen(false);
            setRegisterName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterConfirmPassword('');
            setHasAdmin(true);
        } catch (error: any) {
            const message = error.message || 'Error al crear administrador';
            showToast(message, 'error');
            if (message.includes('Ya existe')) {
                setHasAdmin(true);
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <div className="text-center">
                        <div className="flex justify-center mb-2 text-blue-600">
                            <Utensils size={48} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">OrdenaYa</h1>
                        <p className="text-gray-500 text-sm">Sistema de Pedidos en Tiempo Real</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@ordenaya.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            fullWidth
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            fullWidth
                        />
                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            variant="primary"
                        >
                            Iniciar Sesión
                        </Button>
                    </form>

                    {/* Botón para crear administrador (solo visible si no existe admin) */}
                    {!hasAdmin && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsRegisterModalOpen(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 mx-auto"
                            >
                                <UserPlus size={14} />
                                Crear cuenta de administrador
                            </button>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Modal de registro de administrador */}
            <Modal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                title="Crear Administrador del Sistema"
                showConfirm
                confirmText="Crear Administrador"
                onConfirm={handleRegister}
                isLoading={isRegistering}
            >
                <div className="space-y-4">
                    <Input
                        label="Nombre completo"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Juan Pérez"
                        fullWidth
                        error={registerErrors.name}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="admin@ordenaya.com"
                        fullWidth
                        error={registerErrors.email}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••"
                        fullWidth
                        error={registerErrors.password}
                    />
                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        fullWidth
                        error={registerErrors.confirm}
                    />
                    <div className="text-xs text-gray-500">
                        Este usuario tendrá permisos de SUPER_ADMIN y podrá gestionar todo el sistema.
                    </div>
                </div>
            </Modal>
        </div>
    );
};