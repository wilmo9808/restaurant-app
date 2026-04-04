import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { FullPageSpinner } from '../../../components/UI/Spinner';
import { Role } from '../../../types/user';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, token, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, []);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <FullPageSpinner />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};