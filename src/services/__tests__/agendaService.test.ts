import { describe, it, expect } from 'vitest';
import { agendaService } from '../agendaService';
import { server } from '../../test/setup';
import { http, HttpResponse } from 'msw';
import { baseUrl } from '../../test/handlers';

describe('agendaService', () => {
  describe('getAll', () => {
    it('should return all agendas', async () => {
      const agendas = await agendaService.getAll();
      expect(agendas).toHaveLength(2);
      expect(agendas[0].title).toBe('Pauta Teste 1');
    });
  });

  describe('getById', () => {
    it('should return an agenda by id', async () => {
      const agenda = await agendaService.getById(1);
      expect(agenda.id).toBe(1);
      expect(agenda.title).toBe('Pauta Teste 1');
    });

    it('should throw error when agenda not found', async () => {
      server.use(
        http.get(`${baseUrl}/agendas/999`, () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        })
      );
      await expect(agendaService.getById(999)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new agenda', async () => {
      const newAgenda = await agendaService.create({ title: 'Nova Pauta', description: 'Desc' });
      expect(newAgenda.id).toBe(3);
      expect(newAgenda.title).toBe('Nova Pauta');
    });
  });
});
