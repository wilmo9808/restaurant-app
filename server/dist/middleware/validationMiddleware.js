"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrder = exports.validateLogin = exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: 'Error de validación',
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        next();
    };
};
exports.validate = validate;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos' });
        return;
    }
    if (!email.includes('@')) {
        res.status(400).json({ message: 'Email inválido' });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const validateOrder = (req, res, next) => {
    const { tableNumber, items, total } = req.body;
    if (!tableNumber || typeof tableNumber !== 'number') {
        res.status(400).json({ message: 'Número de mesa requerido' });
        return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'Debe incluir al menos un item' });
        return;
    }
    if (typeof total !== 'number' || total <= 0) {
        res.status(400).json({ message: 'Total inválido' });
        return;
    }
    next();
};
exports.validateOrder = validateOrder;
