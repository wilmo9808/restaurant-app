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