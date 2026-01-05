
import { create } from 'zustand';
import { UserRole } from '../types';

interface UserState {
  role: UserRole | null;
  tableId: string | null;
  login: (role: UserRole, tableId?: string) => void;
  logout: () => void;
  setTableId: (tableId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  tableId: null,
  login: (role, tableId) => set({ role, tableId: tableId || null }),
  logout: () => set({ role: null, tableId: null }),
  setTableId: (tableId) => set({ tableId }),
}));
