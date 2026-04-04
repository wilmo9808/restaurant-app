import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = false,
    className = '',
    id,
    type = 'text',
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    type={inputType}
                    className={`
                        w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2
                        ${isPassword ? 'pr-10' : ''}
                        ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }
                    `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};