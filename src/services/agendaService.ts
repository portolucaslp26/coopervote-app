import axios from 'axios';
import type { Agenda, CreateAgendaRequest } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
});

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