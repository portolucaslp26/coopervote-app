import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:8080/api/v1';

interface Agenda {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface VotingSession {
  id: number;
  agendaId: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Vote {
  id: number;
  sessionId: number;
  associateCpf: string;
  voteValue: boolean;
  createdAt: string;
}

interface VotingResult {
  sessionId: number;
  agendaId: number;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  result: 'APPROVED' | 'REJECTED' | 'DRAW';
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  return response.json();
}

describe('Fluxo Completo de Votação', () => {
  let agendaId: number;
  let sessionId: number;

  it('1. Criar Pauta', async () => {
    const agenda = await fetchJSON<Agenda>(`${BASE_URL}/agendas`, {
      method: 'POST',
      body: JSON.stringify({
        title: `Pauta Teste Automação ${Date.now()}`,
        description: 'Teste de automação de fluxo',
      }),
    });
    
    expect(agenda).toHaveProperty('id');
    expect(agenda).toHaveProperty('title');
    agendaId = agenda.id;
    console.log('✓ Pauta criada:', agendaId);
  });

  it('2. Listar Pautas', async () => {
    const agendas = await fetchJSON<Agenda[]>(`${BASE_URL}/agendas`);
    expect(agendas).toBeInstanceOf(Array);
    expect(agendas.length).toBeGreaterThan(0);
    console.log('✓ Pautas listadas:', agendas.length);
  });

  it('3. Buscar Pauta por ID', async () => {
    const agenda = await fetchJSON<Agenda>(`${BASE_URL}/agendas/${agendaId}`);
    expect(agenda.id).toBe(agendaId);
    console.log('✓ Pauta buscada:', agendaId);
  });

  it('4. Abrir Sessão de Votação', async () => {
    const session = await fetchJSON<VotingSession>(`${BASE_URL}/sessions/agenda/${agendaId}`, {
      method: 'POST',
      body: JSON.stringify({ durationMinutes: 5 }),
    });
    
    expect(session).toHaveProperty('id');
    expect(session.agendaId).toBe(agendaId);
    expect(session.isActive).toBe(true);
    sessionId = session.id;
    console.log('✓ Sessão aberta:', sessionId);
  });

  it('5. Buscar Sessão por ID', async () => {
    const session = await fetchJSON<VotingSession>(`${BASE_URL}/sessions/${sessionId}`);
    expect(session.id).toBe(sessionId);
    expect(session.isActive).toBe(true);
    console.log('✓ Sessão buscada:', sessionId);
  });

  it('6. Buscar Sessão por Agenda', async () => {
    const session = await fetchJSON<VotingSession>(`${BASE_URL}/sessions/agenda/${agendaId}`);
    expect(session.agendaId).toBe(agendaId);
    console.log('✓ Sessão encontrada');
  });

  it('7. Votar SIM', async () => {
    try {
      const vote = await fetchJSON<Vote>(`${BASE_URL}/votes/session/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify({
          cpf: '07598851080',
          voteValue: true,
        }),
      });
      
      expect(vote).toHaveProperty('id');
      expect(vote.sessionId).toBe(sessionId);
      console.log('✓ Voto SIM registrado');
    } catch (error: any) {
      if (error.message.includes('422') && error.message.includes('UNABLE_TO_VOTE')) {
        console.log('⚠ CPF não autorizado para votação');
      } else {
        throw error;
      }
    }
  });

  it('8. Votar NÃO', async () => {
    try {
      const vote = await fetchJSON<Vote>(`${BASE_URL}/votes/session/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify({
          cpf: '07598851080',
          voteValue: false,
        }),
      });
      
      expect(vote).toHaveProperty('id');
      expect(vote.sessionId).toBe(sessionId);
      expect(vote.voteValue).toBe(false);
      console.log('✓ Voto NÃO registrado');
    } catch (error: any) {
      if (error.message.includes('422') && error.message.includes('UNABLE_TO_VOTE')) {
        console.log('⚠ CPF não autorizado para votação');
      } else {
        throw error;
      }
    }
  });

  it('9. Ver Resultado', async () => {
    const result = await fetchJSON<VotingResult>(`${BASE_URL}/votes/session/${sessionId}/result`);
    
    expect(result).toHaveProperty('yesVotes');
    expect(result).toHaveProperty('noVotes');
    expect(result).toHaveProperty('totalVotes');
    expect(result).toHaveProperty('result');
    expect(result.yesVotes).toBeGreaterThanOrEqual(0);
    console.log('✓ Resultado:', result.result, '- SIM:', result.yesVotes, 'NÃO:', result.noVotes);
  });

  it('10. Encerrar Sessão', async () => {
    const session = await fetchJSON<VotingSession>(`${BASE_URL}/sessions/${sessionId}/close`, {
      method: 'POST',
    });
    
    expect(session.isActive).toBe(false);
    expect(session.endTime).toBeTruthy();
    console.log('✓ Sessão encerrada');
  });

  it('11. Tentar votar em sessão encerrada', async () => {
    try {
      await fetchJSON<Vote>(`${BASE_URL}/votes/session/${sessionId}`, {
        method: 'POST',
        body: JSON.stringify({
          cpf: '12345678903',
          voteValue: true,
        }),
      });
      throw new Error('Deveria ter falhado');
    } catch (error: any) {
      expect(error.message).toContain('422');
      console.log('✓ Voto em sessão encerrada bloqueado');
    }
  });
});