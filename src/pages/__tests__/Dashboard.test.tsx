import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.spyOn(agendaService, 'getAll').mockReturnValue(new Promise(() => {}));
    renderWithRouter(<Dashboard />);
    expect(screen.queryByRole('heading', { name: /Dashboard/i })).not.toBeInTheDocument();
  });

  it('should render dashboard title', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard de Agendas')).toBeInTheDocument();
    });
  });

  it('should render welcome message', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Bem-vindo/)).toBeInTheDocument();
    });
  });

  it('should render Nova Pauta button', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Nova Pauta')).toBeInTheDocument();
    });
  });

  it('should render stats with zero values', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Pautas Totais')).toBeInTheDocument();
      expect(screen.getByText('Sessoes Ativas')).toBeInTheDocument();
    });
  });

  it('should render agenda cards', async () => {
    const mockAgendas = [
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
      { id: 2, title: 'Pauta 2', description: 'Desc 2', createdAt: '2026-04-27' },
    ];
    vi.spyOn(agendaService, 'getAll').mockResolvedValue(mockAgendas);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Pauta 1')).toBeInTheDocument();
      expect(screen.getByText('Pauta 2')).toBeInTheDocument();
    });
  });

  it('should render Pendente badge for agenda without session', async () => {
    const mockAgendas = [
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
    ];
    vi.spyOn(agendaService, 'getAll').mockResolvedValue(mockAgendas);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Pendente')).toBeInTheDocument();
    });
  });

  it('should render Ativo badge for agenda with active session', async () => {
    const mockAgendas = [
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
    ];
    vi.spyOn(agendaService, 'getAll').mockResolvedValue(mockAgendas);
    vi.spyOn(sessionService, 'getByAgendaId').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-05-12T10:00:00',
      endTime: '2099-12-31T23:59:59',
      isActive: true,
    });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  it('should render Sem sessao text for agenda without session', async () => {
    const mockAgendas = [
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
    ];
    vi.spyOn(agendaService, 'getAll').mockResolvedValue(mockAgendas);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Sem sessao')).toBeInTheDocument();
    });
  });
});
