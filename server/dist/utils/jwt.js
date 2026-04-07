"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET no ha sido configurado en el entorno de producción.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-super-seguro-para-el-restaurante-2026';
const generateToken = (payload) => {
    // Reducido a 1d por mejores prácticas de seguridad
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
