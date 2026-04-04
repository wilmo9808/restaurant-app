export const ROLES = {
    WAITER: 'WAITER',
    CHEF: 'CHEF',
    CASHIER: 'CASHIER',
    SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En preparación',
    READY: 'Listo para servir',
    COMPLETED: 'Completado',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    READY: 'bg-green-500',
    COMPLETED: 'bg-gray-500',
};

export const PRODUCT_CATEGORIES = {
    BURGERS: 'Hamburguesas',
    DRINKS: 'Bebidas',
    SIDES: 'Acompañantes',
    DESSERTS: 'Postres',
    HOT_DOGS: 'Perros Calientes',
    NACHOS: 'Nachos',
} as const;

// Mantenido como fallback, pero ahora se cargará desde API
export const TABLE_NUMBERS_FALLBACK = Array.from({ length: 15 }, (_, i) => i + 1);