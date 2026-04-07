"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateOnly = exports.formatDate = exports.formatCurrency = void 0;
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(value);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};
exports.formatDate = formatDate;
const formatDateOnly = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
    }).format(date);
};
exports.formatDateOnly = formatDateOnly;
