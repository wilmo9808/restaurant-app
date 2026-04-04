import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

const toastStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
};

export const Toast: React.FC = () => {
    const { toastMessage, toastType, hideToast } = useUIStore();

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage, hideToast]);

    if (!toastMessage || !toastType) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`${toastStyles[toastType]} rounded-lg shadow-lg px-6 py-3 flex items-center gap-3`}>
                {toastType === 'success' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {toastType === 'error' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {toastType === 'info' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <span className="font-medium">{toastMessage}</span>
            </div>
        </div>
    );
};