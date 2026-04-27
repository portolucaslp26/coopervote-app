import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VotingPage } from '../Voting';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('VotingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.spyOn(sessionService, 'getById').mockReturnValue(new Promise(() => {}));
    renderWithRouter(<VotingPage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render voting page with agenda data', async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-28T11:00:00', // Future date
      isActive: true,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Desc',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<VotingPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pauta Teste' })).toBeInTheDocument();
    });
  });

  it('should show SIM and NAO buttons when loaded', async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-28T11:00:00', // Future date
      isActive: true,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Desc',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<VotingPage />);

    await waitFor(() => {
      expect(screen.getByText('SIM')).toBeInTheDocument();
      expect(screen.getByText('NAO')).toBeInTheDocument();
    });
  });
});
