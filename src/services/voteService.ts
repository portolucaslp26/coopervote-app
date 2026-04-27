import { api } from './api';
import type { Vote, CastVoteRequest, VotingResult } from '../types';

export const voteService = {
  cast: async (sessionId: number, request: CastVoteRequest): Promise<Vote> => {
    const response = await api.post<Vote>(`/votes/session/${sessionId}`, request);
    return response.data;
  },

  getResult: async (sessionId: number): Promise<VotingResult> => {
    const response = await api.get<VotingResult>(`/votes/session/${sessionId}/result`);
    return response.data;
  },
};