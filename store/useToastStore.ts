
import { create } from 'zustand';

interface ToastState {
  message: string;
  isOpen: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  isOpen: false,
  showToast: (message) => {
    set({ message, isOpen: true });
    setTimeout(() => {
      set({ isOpen: false });
    }, 2000); // Hide after 2 seconds
  },
  hideToast: () => set({ isOpen: false }),
}));
