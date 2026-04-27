import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VotingPage } from '../Voting';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');

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
      endTime: '2026-04-27T11:00:00',
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
      expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
    });
  });

  it('should show SIM and NAO buttons when loaded', async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: '2026-04-27T10:00:00',
      endTime: '2026-04-27T11:00:00',
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
