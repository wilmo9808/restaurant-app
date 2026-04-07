"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.PRODUCT_CATEGORIES = exports.ORDER_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    WAITER: 'WAITER',
    CHEF: 'CHEF',
    CASHIER: 'CASHIER',
};
exports.ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
};
exports.PRODUCT_CATEGORIES = {
    BURGERS: 'Hamburguesas',
    DRINKS: 'Bebidas',
    SIDES: 'Acompañantes',
    DESSERTS: 'Postres',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
