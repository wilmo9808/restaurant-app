import React from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
    fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    fullWidth = false,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`
          w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2
          ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
        `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};