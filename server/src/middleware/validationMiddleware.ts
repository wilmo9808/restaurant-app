import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body);

        if (error) {
            res.status(400).json({
                message: 'Error de validación',
                details: error.details.map((detail: any) => detail.message),
            });
            return;
        }

        next();
    };
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateOrder = (req: Request, res: Response, next: NextFunction): void => {
    const { tableNumber, items, total } = req.body;

    // Validar número de mesa
    if (!tableNumber || typeof tableNumber !== 'number') {
        res.status(400).json({ message: 'Número de mesa requerido' });
        return;
    }

    if (!Number.isInteger(tableNumber) || tableNumber < 1) {
        res.status(400).json({ message: 'Número de mesa inválido. Debe ser un entero positivo' });
        return;
    }

    // Validar items
    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'Debe incluir al menos un item' });
        return;
    }

    // Validar estructura de cada item
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item.productId || typeof item.productId !== 'string') {
            res.status(400).json({ message: `Item ${i + 1}: productId requerido` });
            return;
        }

        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
            res.status(400).json({ message: `Item ${i + 1}: cantidad debe ser un entero positivo` });
            return;
        }

        if (typeof item.price !== 'number' || item.price < 0) {
            res.status(400).json({ message: `Item ${i + 1}: precio inválido` });
            return;
        }

        // Validar modificaciones/toppings si existen
        if (item.modifications && Array.isArray(item.modifications)) {
            for (const mod of item.modifications) {
                if (typeof mod.price !== 'number' || mod.price < 0) {
                    res.status(400).json({ message: `Item ${i + 1}: precio de modificación inválido` });
                    return;
                }
            }
        }
    }

    // Validar total
    if (typeof total !== 'number' || total <= 0) {
        res.status(400).json({ message: 'Total inválido' });
        return;
    }

    next();
};