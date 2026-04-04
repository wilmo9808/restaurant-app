import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET no ha sido configurado en el entorno de producción.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-super-seguro-para-el-restaurante-2026';

export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export const generateToken = (payload: TokenPayload): string => {
    // Reducido a 1d por mejores prácticas de seguridad
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch {
        return null;
    }
};