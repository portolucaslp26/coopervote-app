import { describe, it, expect } from 'vitest';
import { sessionService } from '../sessionService';
import { server } from '../../test/setup';
import { http, HttpResponse } from 'msw';

describe('sessionService', () => {
  describe('getById', () => {
    it('should return a session by id', async () => {
      const session = await sessionService.getById(1);
      expect(session.id).toBe(1);
      expect(session.isActive).toBe(true);
    });

    it('should throw error when session not found', async () => {
      server.use(
        http.get('*/sessions/999', () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        })
      );
      await expect(sessionService.getById(999)).rejects.toThrow();
    });
  });

  describe('getByAgendaId', () => {
    it('should return session by agenda id', async () => {
      const session = await sessionService.getByAgendaId(1);
      expect(session.agendaId).toBe(1);
    });

    it('should throw error when session not found for agenda', async () => {
      server.use(
        http.get('*/sessions/agenda/999', () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        })
      );
      await expect(sessionService.getByAgendaId(999)).rejects.toThrow();
    });
  });

  describe('open', () => {
    it('should open a new session', async () => {
      const session = await sessionService.open(2, { durationMinutes: 5 });
      expect(session.agendaId).toBe(2);
      expect(session.isActive).toBe(true);
    });
  });

  describe('close', () => {
    it('should close a session', async () => {
      const session = await sessionService.close(1);
      expect(session.isActive).toBe(false);
    });
  });
});
