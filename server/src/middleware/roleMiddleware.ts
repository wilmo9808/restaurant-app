import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
            return;
        }

        next();
    };
};

export const isWaiter = roleMiddleware(['WAITER']);
export const isChef = roleMiddleware(['CHEF']);
export const isCashier = roleMiddleware(['CASHIER']);
export const isChefOrCashier = roleMiddleware(['CHEF', 'CASHIER']);
export const isWaiterOrCashier = roleMiddleware(['WAITER', 'CASHIER']);
export const isAdmin = roleMiddleware(['SUPER_ADMIN']);
export const isAdminOrWaiter = roleMiddleware(['SUPER_ADMIN', 'WAITER']);
export const isAdminOrChef = roleMiddleware(['SUPER_ADMIN', 'CHEF']);
export const isAdminOrCashier = roleMiddleware(['SUPER_ADMIN', 'CASHIER']);