import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return (
        <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
    return (
        <div className={`px-4 py-3 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
};