import { http, HttpResponse, delay } from 'msw';
import type { Agenda, VotingSession, VotingResult, CastVoteRequest } from '../../types';

const baseUrl = 'http://localhost:8080/api/v1';

let agendas: Agenda[] = [
  { id: 1, title: 'Pauta Teste 1', description: 'Descricao 1', createdAt: '2026-04-27' },
  { id: 2, title: 'Pauta Teste 2', description: 'Descricao 2', createdAt: '2026-04-27' },
];

let sessions: VotingSession[] = [
  { id: 1, agendaId: 1, startTime: '2026-04-27T10:00:00', endTime: '2026-04-27T11:00:00', isActive: true },
];

let results: Map<number, VotingResult> = new Map();
results.set(1, {
  sessionId: 1,
  agendaId: 1,
  yesVotes: 10,
  noVotes: 5,
  totalVotes: 15,
  result: 'APPROVED',
});

let nextAgendaId = 3;
let nextSessionId = 2;

export const handlers = [
  http.get(`${baseUrl}/agendas`, async () => {
    await delay(100);
    return HttpResponse.json(agendas);
  }),

  http.get(`${baseUrl}/agendas/:id`, async ({ params }) => {
    await delay(100);
    const agenda = agendas.find(a => a.id === Number(params.id));
    if (!agenda) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(agenda);
  }),

  http.post<{ title: string; description?: string }>(`${baseUrl}/agendas`, async ({ request }) => {
    await delay(100);
    const body = await request.json() as { title: string; description?: string };
    const { title, description } = body;
    const newAgenda: Agenda = {
      id: nextAgendaId++,
      title,
      description: description || '',
      createdAt: new Date().toISOString(),
    };
    agendas.push(newAgenda);
    return HttpResponse.json(newAgenda, { status: 201 });
  }),

  http.get(`${baseUrl}/sessions/:id`, async ({ params }) => {
    await delay(100);
    const session = sessions.find(s => s.id === Number(params.id));
    if (!session) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(session);
  }),

  http.get(`${baseUrl}/sessions/agenda/:agendaId`, async ({ params }) => {
    await delay(100);
    const session = sessions.find(s => s.agendaId === Number(params.agendaId));
    if (!session) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(session);
  }),

  http.post<{ durationMinutes?: number }>(`${baseUrl}/sessions/agenda/:agendaId`, async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as { durationMinutes?: number };
    const { durationMinutes = 1 } = body;
    const newSession: VotingSession = {
      id: nextSessionId++,
      agendaId: Number(params.agendaId),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + durationMinutes * 60000).toISOString(),
      isActive: true,
    };
    sessions.push(newSession);
    return HttpResponse.json(newSession, { status: 201 });
  }),

  http.post(`${baseUrl}/sessions/:id/close`, async ({ params }) => {
    await delay(100);
    const session = sessions.find(s => s.id === Number(params.id));
    if (!session) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    session.isActive = false;
    session.endTime = new Date().toISOString();
    return HttpResponse.json(session);
  }),

  http.post<CastVoteRequest>(`${baseUrl}/votes/session/:sessionId`, async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as CastVoteRequest;
    const { cpf, voteValue } = body;
    if (!cpf || cpf.length !== 11) return HttpResponse.json({ message: 'Invalid CPF' }, { status: 422 });
    const session = sessions.find(s => s.id === Number(params.sessionId));
    if (!session) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    if (!session.isActive) return HttpResponse.json({ message: 'Session closed' }, { status: 409 });
    return HttpResponse.json({
      id: Date.now(),
      sessionId: session.id,
      associateCpf: cpf,
      voteValue,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.get(`${baseUrl}/votes/session/:sessionId/result`, async ({ params }) => {
    await delay(100);
    const result = results.get(Number(params.sessionId));
    if (!result) {
      return HttpResponse.json({
        sessionId: Number(params.sessionId),
        agendaId: 0,
        yesVotes: 0,
        noVotes: 0,
        totalVotes: 0,
        result: 'DRAW',
      });
    }
    return HttpResponse.json(result);
  }),
];
