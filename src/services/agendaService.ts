import { api } from './api';
import type { Agenda, CreateAgendaRequest } from '../types';

export const agendaService = {
  getAll: async (): Promise<Agenda[]> => {
    const response = await api.get<Agenda[]>('/agendas');
    return response.data;
  },

  getById: async (id: number): Promise<Agenda> => {
    const response = await api.get<Agenda>(`/agendas/${id}`);
    return response.data;
  },

  create: async (request: CreateAgendaRequest): Promise<Agenda> => {
    const response = await api.post<Agenda>('/agendas', request);
    return response.data;
  },
};