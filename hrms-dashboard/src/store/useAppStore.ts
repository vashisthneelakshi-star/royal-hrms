import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, User, Notification, AIInsight } from '../types';

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
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'hrms-app-storage',
      partialize: (state) => ({ theme: state.theme, user: state.user }),
    }
  )
);