import axios from 'axios';
import type { Vote, CastVoteRequest, VotingResult } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
});

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