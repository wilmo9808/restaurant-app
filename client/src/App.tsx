import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './features/auth/pages/Login';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { WaiterDashboard } from './features/waiter/pages/WaiterDashboard';
import { KitchenDashboard } from './features/kitchen/pages/KitchenDashboard';
import { CashierDashboard } from './features/cashier/pages/CashierDashboard';
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import { PublicMenu } from './features/menu/pages/PublicMenu';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/menu/:tableId?" element={<PublicMenu />} />
                    <Route
                        path="/waiter"
                        element={
                            <ProtectedRoute allowedRoles={['WAITER']}>
                                <WaiterDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/kitchen"
                        element={
                            <ProtectedRoute allowedRoles={['CHEF']}>
                                <KitchenDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cashier"
                        element={
                            <ProtectedRoute allowedRoles={['CASHIER']}>
                                <CashierDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;