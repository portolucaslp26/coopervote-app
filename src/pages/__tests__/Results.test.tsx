import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Results } from '../Results';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';
import { voteService } from '../../services/voteService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');
vi.mock('../../services/voteService');

const renderWithRouter = (component: React.ReactElement) => {
  vi.doMock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useParams: () => ({ id: '1' }),
    };
  });
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.spyOn(sessionService, 'getById').mockReturnValue(new Promise(() => {}));
    renderWithRouter(<Results />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render results page with data', async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-27T11:00:00',
      isActive: false,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Desc',
      createdAt: '2026-04-27',
    });
    vi.spyOn(voteService, 'getResult').mockResolvedValue({
      sessionId: 1,
      agendaId: 1,
      yesVotes: 10,
      noVotes: 5,
      totalVotes: 15,
      result: 'APPROVED',
    });

    renderWithRouter(<Results />);

    await waitFor(() => {
      expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
      expect(screen.getByText('Aprovado')).toBeInTheDocument();
      expect(screen.getByText('Veredito Final')).toBeInTheDocument();
    });
  });

  it('should show DRAW when result is draw', async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-27T11:00:00',
      isActive: false,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Desc',
      createdAt: '2026-04-27',
    });
    vi.spyOn(voteService, 'getResult').mockResolvedValue({
      sessionId: 1,
      agendaId: 1,
      yesVotes: 5,
      noVotes: 5,
      totalVotes: 10,
      result: 'DRAW',
    });

    renderWithRouter(<Results />);

    await waitFor(() => {
      expect(screen.getByText('Empate')).toBeInTheDocument();
    });
  });
});
