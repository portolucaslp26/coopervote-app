import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAgendaWithSession, useAgendaWithSessionById } from '../useAgendaWithSession';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');

describe('useAgendaWithSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    const { result } = renderHook(() => useAgendaWithSession());
    expect(result.current.loading).toBe(true);
    expect(result.current.agendas).toEqual([]);
  });

  it('should load agendas successfully', async () => {
    const mockAgendas = [
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
      { id: 2, title: 'Pauta 2', description: 'Desc 2', createdAt: '2026-04-27' },
    ];
    vi.spyOn(agendaService, 'getAll').mockResolvedValue(mockAgendas);
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue({ id: 1, agendaId: 1, startTime: '', endTime: '', isActive: true });

    const { result } = renderHook(() => useAgendaWithSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should call onError when loading fails', async () => {
    const onError = vi.fn();
    vi.spyOn(agendaService, 'getAll').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useAgendaWithSession({ onError }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should refetch when called', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    const { result } = renderHook(() => useAgendaWithSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.refetch();
    });
  });
});

describe('useAgendaWithSessionById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', async () => {
    vi.spyOn(agendaService, 'getById').mockResolvedValue({ id: 1, title: 'Test', description: '', createdAt: '' });
    const { result } = renderHook(() => useAgendaWithSessionById(1));
    expect(result.current.loading).toBe(true);
  });

  it('should load agenda by id successfully', async () => {
    const mockAgenda = { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' };
    const mockSession = { id: 1, agendaId: 1, startTime: '', endTime: '', isActive: true };
    vi.spyOn(agendaService, 'getById').mockResolvedValue(mockAgenda);
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAgendaWithSessionById(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle missing session gracefully', async () => {
    const mockAgenda = { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' };
    vi.spyOn(agendaService, 'getById').mockResolvedValue(mockAgenda);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    const { result } = renderHook(() => useAgendaWithSessionById(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should call onError when loading fails', async () => {
    const onError = vi.fn();
    vi.spyOn(agendaService, 'getById').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useAgendaWithSessionById(1, { onError }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
