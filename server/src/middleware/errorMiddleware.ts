import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorMiddleware = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};