"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFirstAdmin = exports.checkFirstAdmin = exports.getProfile = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const getErrorMessage = (error, fallback) => {
    if (process.env.NODE_ENV === 'production')
        return fallback;
    return error.message || fallback;
};
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const result = await (0, authService_1.registerUser)({
            email,
            password,
            name,
            role,
        });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: getErrorMessage(error, 'Error al registrar usuario'),
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, authService_1.loginUser)({
            email,
            password,
        });
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: result,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: getErrorMessage(error, 'Error al iniciar sesión'),
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'No autenticado',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al obtener perfil'),
        });
    }
};
exports.getProfile = getProfile;
// ==================== REGISTRO DE PRIMER ADMIN ====================
const checkFirstAdmin = async (req, res) => {
    try {
        const adminExists = await database_1.default.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });
        res.status(200).json({
            success: true,
            data: { hasAdmin: !!adminExists },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al verificar administrador'),
        });
    }
};
exports.checkFirstAdmin = checkFirstAdmin;
const registerFirstAdmin = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        // Verificar si ya existe un SUPER_ADMIN
        const existingAdmin = await database_1.default.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });
        if (existingAdmin) {
            res.status(403).json({
                success: false,
                message: 'Ya existe un administrador en el sistema. No se puede crear otro.',
            });
            return;
        }
        // Validar campos requeridos
        if (!email || !name || !password) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
            });
            return;
        }
        // Validar email único
        const existingUser = await database_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado',
            });
            return;
        }
        // Crear SUPER_ADMIN
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        const user = await database_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Administrador creado exitosamente. Ahora puedes iniciar sesión.',
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: getErrorMessage(error, 'Error al crear administrador'),
        });
    }
};
exports.registerFirstAdmin = registerFirstAdmin;
