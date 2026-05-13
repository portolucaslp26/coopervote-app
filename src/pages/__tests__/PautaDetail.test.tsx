import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PautaDetail } from '../PautaDetail';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';
import { voteService } from '../../services/voteService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');
vi.mock('../../services/voteService');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter initialEntries={['/pautas/1']}>{component}</MemoryRouter>);
};

describe('PautaDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.spyOn(agendaService, 'getById').mockReturnValue(new Promise(() => {}));
    renderWithRouter(<PautaDetail />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should render agenda title', async () => {
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<PautaDetail />);

    await waitFor(() => {
      expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
    });
  });

  it('should render Pendente when no session', async () => {
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<PautaDetail />);

    await waitFor(() => {
      expect(screen.getByText('Pendente')).toBeInTheDocument();
    });
  });

  it('should render Ativo when session is active', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);

    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: futureDate.toISOString(),
      isActive: true,
    });

    renderWithRouter(<PautaDetail />);

    await waitFor(() => {
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  it('should render Encerrado when session is closed', async () => {
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-27T11:00:00',
      isActive: false,
    });
    vi.spyOn(voteService, 'getResult').mockResolvedValue({
      sessionId: 1,
      agendaId: 1,
      yesVotes: 10,
      noVotes: 5,
      totalVotes: 15,
      result: 'APPROVED',
    });

    renderWithRouter(<PautaDetail />);

    await waitFor(() => {
      expect(screen.getByText('Encerrado')).toBeInTheDocument();
    });
  });

  it('should render Aprovado result', async () => {
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-27T11:00:00',
      isActive: false,
    });
    vi.spyOn(voteService, 'getResult').mockResolvedValue({
      sessionId: 1,
      agendaId: 1,
      yesVotes: 10,
      noVotes: 5,
      totalVotes: 15,
      result: 'APPROVED',
    });

    renderWithRouter(<PautaDetail />);

    await waitFor(() => {
      expect(screen.getByText('Aprovado')).toBeInTheDocument();
    });
  });
});