import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, User, Notification, AIInsight } from '../types';

export interface ColumnConfig {
  key: string;
  label: string;
  type: string;
  visible: boolean;
  mandatory: boolean;
}

const defaultColumns: ColumnConfig[] = [
  { key: 'employeeCode', label: 'Employee Code', type: 'text', visible: true, mandatory: true },
  { key: 'name', label: 'Full Name', type: 'text', visible: true, mandatory: true },
  { key: 'profile', label: 'Profile', type: 'text', visible: true, mandatory: true },
  { key: 'branch', label: 'Branch', type: 'text', visible: true, mandatory: true },
  { key: 'state', label: 'State', type: 'text', visible: true, mandatory: true },
  { key: 'status', label: 'Status', type: 'text', visible: true, mandatory: true },
  { key: 'mobile', label: 'Mobile', type: 'mobile', visible: true, mandatory: false },
  { key: 'email', label: 'Email', type: 'email', visible: false, mandatory: false },
  { key: 'totalCTC', label: 'Total CTC', type: 'currency', visible: true, mandatory: true },
];

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  aiInsights: AIInsight[];
  setAiInsights: (insights: AIInsight[]) => void;
  columns: ColumnConfig[];
  setColumns: (columns: ColumnConfig[]) => void;
  moveColumn: (index: number, direction: 'up' | 'down') => void;
  removeColumn: (key: string) => void;
  addColumn: (col: ColumnConfig) => void;
  toggleColumnVisibility: (key: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },
      user: null,
      setUser: (user) => set({ user }),
      employees: [],
      setEmployees: (employees) => set({ employees }),
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      aiInsights: [],
      setAiInsights: (insights) => set({ aiInsights: insights }),
      columns: defaultColumns,
      setColumns: (columns) => set({ columns }),
      moveColumn: (index, direction) => {
        const cols = [...get().columns];
        if (direction === 'up' && index > 0) {
          [cols[index], cols[index - 1]] = [cols[index - 1], cols[index]];
        } else if (direction === 'down' && index < cols.length - 1) {
          [cols[index], cols[index + 1]] = [cols[index + 1], cols[index]];
        }
        set({ columns: cols });
      },
      removeColumn: (key) => {
        set((state) => ({ columns: state.columns.filter((c) => c.key !== key) }));
      },
      addColumn: (col) => {
        set((state) => ({ columns: [...state.columns, col] }));
      },
      toggleColumnVisibility: (key) => {
        set((state) => ({
          columns: state.columns.map((c) =>
            c.key === key ? { ...c, visible: !c.visible } : c
          ),
        }));
      },
    }),
    {
      name: 'hrms-app-storage',
      partialize: (state) => ({ theme: state.theme, user: state.user, columns: state.columns }),
    }
  )
);