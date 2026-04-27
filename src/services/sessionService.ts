import { api } from './api';
import type { VotingSession, OpenSessionRequest } from '../types';

export const sessionService = {
  open: async (agendaId: number, request: OpenSessionRequest): Promise<VotingSession> => {
    const response = await api.post<VotingSession>(`/sessions/agenda/${agendaId}`, request);
    return response.data;
  },

  getById: async (id: number): Promise<VotingSession> => {
    const response = await api.get<VotingSession>(`/sessions/${id}`);
    return response.data;
  },

  getByAgendaId: async (agendaId: number): Promise<VotingSession> => {
    const response = await api.get<VotingSession>(`/sessions/agenda/${agendaId}`);
    return response.data;
  },

  close: async (id: number): Promise<VotingSession> => {
    const response = await api.post<VotingSession>(`/sessions/${id}/close`, {});
    return response.data;
  },
};