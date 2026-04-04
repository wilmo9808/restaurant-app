"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const registerUser = async (data) => {
    const existingUser = await database_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error('El email ya está registrado');
    }
    const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
    const user = await database_1.default.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
            role: data.role || 'WAITER',
            isActive: data.isActive !== undefined ? data.isActive : true,
        },
    });
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const token = (0, jwt_1.generateToken)(payload);
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        },
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    console.log('🔐 Intentando login con email:', data.email);
    const user = await database_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        console.log('❌ Usuario no encontrado:', data.email);
        throw new Error('Credenciales inválidas');
    }
    if (!user.isActive) {
        console.log('❌ Usuario inactivo:', data.email);
        throw new Error('Usuario inactivo. Contacte al administrador');
    }
    console.log('✅ Usuario encontrado:', user.email);
    console.log('📝 Hash almacenado:', user.password.substring(0, 20) + '...');
    const isPasswordValid = await (0, bcrypt_1.comparePassword)(data.password, user.password);
    console.log('🔑 ¿Contraseña válida?', isPasswordValid);
    if (!isPasswordValid) {
        console.log('❌ Contraseña incorrecta para:', data.email);
        throw new Error('Credenciales inválidas');
    }
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const token = (0, jwt_1.generateToken)(payload);
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        },
        token,
    };
};
exports.loginUser = loginUser;
const getUserById = async (id) => {
    const user = await database_1.default.user.findUnique({
        where: { id },
    });
    if (!user)
        return null;
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
};
exports.getUserById = getUserById;
