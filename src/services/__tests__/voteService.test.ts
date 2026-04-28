import { describe, it, expect } from 'vitest';
import { voteService } from '../voteService';
import { server } from '../../test/setup';
import { http, HttpResponse } from 'msw';

describe('voteService', () => {
  describe('cast', () => {
    it('should cast a vote successfully', async () => {
      const vote = await voteService.cast(1, { cpf: '12345678901', voteValue: true });
      expect(vote.sessionId).toBe(1);
      expect(vote.voteValue).toBe(true);
    });

    it('should throw error when CPF is invalid', async () => {
      await expect(
        voteService.cast(1, { cpf: '123', voteValue: true })
      ).rejects.toThrow();
    });

    it('should throw error when session is closed', async () => {
      server.use(
        http.post('*/votes/session/2', () => {
          return HttpResponse.json({ message: 'Session closed' }, { status: 409 });
        })
      );
      await expect(
        voteService.cast(2, { cpf: '12345678901', voteValue: true })
      ).rejects.toThrow();
    });

    it('should throw error when session not found', async () => {
      server.use(
        http.post('*/votes/session/999', () => {
          return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        })
      );
      await expect(
        voteService.cast(999, { cpf: '12345678901', voteValue: true })
      ).rejects.toThrow();
    });
  });

  describe('getResult', () => {
    it('should return voting result', async () => {
      const result = await voteService.getResult(1);
      expect(result.sessionId).toBe(1);
      expect(result.result).toBe('APPROVED');
      expect(result.yesVotes).toBe(10);
    });

    it('should return empty result when no votes', async () => {
      const result = await voteService.getResult(999);
      expect(result.result).toBe('DRAW');
      expect(result.totalVotes).toBe(0);
    });
  });
});
