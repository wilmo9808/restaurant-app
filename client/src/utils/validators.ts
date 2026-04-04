export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
};

export const validateTableNumber = (tableNumber: number): boolean => {
    return tableNumber >= 1 && tableNumber <= 15;
};

export const validateQuantity = (quantity: number): boolean => {
    return quantity >= 1 && quantity <= 50;
};

export const validateOrderTotal = (total: number): boolean => {
    return total > 0;
};

export const validateProductPrice = (price: number): boolean => {
    return price > 0;
};

export const validateProductName = (name: string): boolean => {
    return name.trim().length >= 3;
};