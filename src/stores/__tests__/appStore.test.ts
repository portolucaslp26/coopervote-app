import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      agendas: [],
      currentAgenda: null,
      currentSession: null,
      toasts: [],
      isLoading: false,
      error: null,
    });
  });

  it('should set agendas', () => {
    const mockAgendas = [{ id: 1, title: 'Test', description: 'Desc', createdAt: '2026-01-01' }];
    useAppStore.getState().setAgendas(mockAgendas);
    expect(useAppStore.getState().agendas).toEqual(mockAgendas);
  });

  it('should set current agenda', () => {
    const mockAgenda = { id: 1, title: 'Test', description: 'Desc', createdAt: '2026-01-01' };
    useAppStore.getState().setCurrentAgenda(mockAgenda);
    expect(useAppStore.getState().currentAgenda).toEqual(mockAgenda);
  });

  it('should set current session', () => {
    const mockSession = { id: 1, agendaId: 1, startTime: '2026-01-01', endTime: '2026-01-02', isActive: true };
    useAppStore.getState().setCurrentSession(mockSession);
    expect(useAppStore.getState().currentSession).toEqual(mockSession);
  });

  it('should add toast', () => {
    useAppStore.getState().addToast({ type: 'success', message: 'Test message' });
    expect(useAppStore.getState().toasts.length).toBe(1);
    expect(useAppStore.getState().toasts[0].message).toBe('Test message');
  });

  it('should remove toast', () => {
    useAppStore.getState().addToast({ type: 'success', message: 'Test' });
    const toastId = useAppStore.getState().toasts[0].id;
    useAppStore.getState().removeToast(toastId);
    expect(useAppStore.getState().toasts.length).toBe(0);
  });

  it('should set loading state', () => {
    useAppStore.getState().setLoading(true);
    expect(useAppStore.getState().isLoading).toBe(true);
  });

  it('should set error state', () => {
    useAppStore.getState().setError('Test error');
    expect(useAppStore.getState().error).toBe('Test error');
  });
});