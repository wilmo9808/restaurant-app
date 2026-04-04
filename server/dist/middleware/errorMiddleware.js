"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
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
exports.errorMiddleware = errorMiddleware;
