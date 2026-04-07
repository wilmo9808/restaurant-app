"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("./cloudinary"));
const path_1 = __importDefault(require("path"));
// Configuración de almacenamiento en Cloudinary
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const publicId = `products/product-${uniqueSuffix}${ext}`;
        return {
            folder: 'ordenaya/products',
            public_id: `product-${uniqueSuffix}`,
            format: 'jpg',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        };
    },
});
// Filtro para solo imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP, GIF)'), false);
    }
};
// Configuración de multer
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
});
// Middleware para subir imagen (campo 'image')
exports.uploadProductImage = exports.upload.single('image');
