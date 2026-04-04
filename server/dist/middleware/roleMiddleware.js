"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrCashier = exports.isAdminOrChef = exports.isAdminOrWaiter = exports.isAdmin = exports.isWaiterOrCashier = exports.isChefOrCashier = exports.isCashier = exports.isChef = exports.isWaiter = exports.roleMiddleware = void 0;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
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
exports.roleMiddleware = roleMiddleware;
exports.isWaiter = (0, exports.roleMiddleware)(['WAITER']);
exports.isChef = (0, exports.roleMiddleware)(['CHEF']);
exports.isCashier = (0, exports.roleMiddleware)(['CASHIER']);
exports.isChefOrCashier = (0, exports.roleMiddleware)(['CHEF', 'CASHIER']);
exports.isWaiterOrCashier = (0, exports.roleMiddleware)(['WAITER', 'CASHIER']);
exports.isAdmin = (0, exports.roleMiddleware)(['SUPER_ADMIN']);
exports.isAdminOrWaiter = (0, exports.roleMiddleware)(['SUPER_ADMIN', 'WAITER']);
exports.isAdminOrChef = (0, exports.roleMiddleware)(['SUPER_ADMIN', 'CHEF']);
exports.isAdminOrCashier = (0, exports.roleMiddleware)(['SUPER_ADMIN', 'CASHIER']);
