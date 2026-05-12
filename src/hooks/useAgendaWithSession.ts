import { useEffect, useState, useCallback } from 'react';
import { agendaService } from '../services/agendaService';
import { sessionService } from '../services/sessionService';
import type { Agenda, VotingSession } from '../types';

export interface AgendaWithSession extends Agenda {
  session?: VotingSession;
}

interface UseAgendaWithSessionOptions {
  onError?: (message: string) => void;
}

export function useAgendaWithSession(options: UseAgendaWithSessionOptions = {}) {
  const [agendas, setAgendas] = useState<AgendaWithSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgendas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await agendaService.getAll();
      const agendasWithSessions = await Promise.all(
        data.map(async (agenda) => {
          try {
            const session = await sessionService.getByAgendaId(agenda.id);
            return { ...agenda, session };
          } catch {
            return { ...agenda, session: undefined };
          }
        })
      );
      setAgendas(agendasWithSessions);
    } catch {
      options.onError?.('Nao foi possivel carregar as pautas');
    } finally {
      setLoading(false);
    }
  }, [options.onError]);

  useEffect(() => {
    loadAgendas();
  }, [loadAgendas]);

  return { agendas, loading, refetch: loadAgendas };
}

export function useAgendaWithSessionById(id: number, options: UseAgendaWithSessionOptions = {}) {
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [session, setSession] = useState<VotingSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const agendaData = await agendaService.getById(id);
      setAgenda(agendaData);

      try {
        const sessionData = await sessionService.getByAgendaId(id);
        setSession(sessionData);
      } catch {
        setSession(null);
      }
    } catch {
      options.onError?.('Nao foi possivel carregar a pauta');
    } finally {
      setLoading(false);
    }
  }, [id, options.onError]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  return { agenda, session, loading, refetch: loadData };
}