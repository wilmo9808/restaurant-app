import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';
import path from 'path';

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
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
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP, GIF)'), false);
    }
};

// Configuración de multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
});

// Middleware para subir imagen (campo 'image')
export const uploadProductImage = upload.single('image');