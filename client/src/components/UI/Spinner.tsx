import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-blue-600' }) => {
    return (
        <div className="flex items-center justify-center">
            <div
                className={`
          ${sizes[size]}
          border-2 ${color} border-t-transparent rounded-full animate-spin
        `}
            />
        </div>
    );
};

export const FullPageSpinner: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <Spinner size="lg" />
        </div>
    );
};