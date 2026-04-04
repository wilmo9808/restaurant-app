import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};