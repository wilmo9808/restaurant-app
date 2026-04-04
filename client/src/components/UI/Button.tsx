import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    children,
    disabled,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                children
            )}
        </button>
    );
};