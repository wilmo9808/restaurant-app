export const ROLES = {
    WAITER: 'WAITER',
    CHEF: 'CHEF',
    CASHIER: 'CASHIER',
} as const;

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
} as const;

export const PRODUCT_CATEGORIES = {
    BURGERS: 'Hamburguesas',
    DRINKS: 'Bebidas',
    SIDES: 'Acompañantes',
    DESSERTS: 'Postres',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;