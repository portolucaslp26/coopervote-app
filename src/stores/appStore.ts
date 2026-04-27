import { create } from 'zustand';
import type { Agenda, VotingSession, Toast } from '../types';

interface AppState {
  agendas: Agenda[];
  currentAgenda: Agenda | null;
  currentSession: VotingSession | null;
  toasts: Toast[];
  isLoading: boolean;
  error: string | null;
  
  setAgendas: (agendas: Agenda[]) => void;
  setCurrentAgenda: (agenda: Agenda | null) => void;
  setCurrentSession: (session: VotingSession | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  agendas: [],
  currentAgenda: null,
  currentSession: null,
  toasts: [],
  isLoading: false,
  error: null,

  setAgendas: (agendas) => set({ agendas }),
  setCurrentAgenda: (agenda) => set({ currentAgenda: agenda }),
  setCurrentSession: (session) => set({ currentSession: session }),
  
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now().toString() }]
  })),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));