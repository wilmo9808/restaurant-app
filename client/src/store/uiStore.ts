import { create } from 'zustand';

interface UIState {
    isModalOpen: boolean;
    modalContent: string | null;
    modalData: any | null;
    toastMessage: string | null;
    toastType: 'success' | 'error' | 'info' | null;
    isLoading: boolean;
    openModal: (content: string, data?: any) => void;
    closeModal: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
    setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isModalOpen: false,
    modalContent: null,
    modalData: null,
    toastMessage: null,
    toastType: null,
    isLoading: false,

    openModal: (content, data) =>
        set({ isModalOpen: true, modalContent: content, modalData: data }),

    closeModal: () =>
        set({ isModalOpen: false, modalContent: null, modalData: null }),

    showToast: (message, type) =>
        set({ toastMessage: message, toastType: type }),

    hideToast: () =>
        set({ toastMessage: null, toastType: null }),

    setLoading: (loading) => set({ isLoading: loading }),
}));