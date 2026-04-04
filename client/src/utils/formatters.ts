export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(value);
};

export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(d);
};

export const formatDateOnly = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
    }).format(d);
};

export const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        timeStyle: 'short',
    }).format(d);
};