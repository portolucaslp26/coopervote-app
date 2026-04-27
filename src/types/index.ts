export interface Agenda {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface CreateAgendaRequest {
  title: string;
  description?: string;
}

export interface VotingSession {
  id: number;
  agendaId: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface OpenSessionRequest {
  durationMinutes?: number;
}

export interface Vote {
  id: number;
  sessionId: number;
  associateCpf: string;
  voteValue: boolean;
  createdAt: string;
}

export interface CastVoteRequest {
  cpf: string;
  voteValue: boolean;
}

export interface VotingResult {
  sessionId: number;
  agendaId: number;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  result: 'APPROVED' | 'REJECTED' | 'DRAW';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}