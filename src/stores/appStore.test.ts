import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './appStore';

describe('useAppStore', () => {
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

  it('deve retornar o estado inicial', () => {
    const state = useAppStore.getState();
    expect(state.agendas).toEqual([]);
    expect(state.currentAgenda).toBeNull();
    expect(state.currentSession).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('deve adicionar toast ao estado', () => {
    const { addToast } = useAppStore.getState();
    addToast({ type: 'success', message: 'Teste sucesso' });
    
    const state = useAppStore.getState();
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Teste sucesso');
  });

  it('deve remover toast do estado', () => {
    const { addToast, removeToast } = useAppStore.getState();
    addToast({ type: 'error', message: 'Teste erro' });
    
    const toastId = useAppStore.getState().toasts[0].id;
    removeToast(toastId);
    
    const state = useAppStore.getState();
    expect(state.toasts).toHaveLength(0);
  });

  it('deve alternar loading', () => {
    const { setLoading } = useAppStore.getState();
    
    setLoading(true);
    expect(useAppStore.getState().isLoading).toBe(true);
    
    setLoading(false);
    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('deve definir error', () => {
    const { setError } = useAppStore.getState();
    
    setError('Erro de teste');
    expect(useAppStore.getState().error).toBe('Erro de teste');
    
    setError(null);
    expect(useAppStore.getState().error).toBeNull();
  });
});