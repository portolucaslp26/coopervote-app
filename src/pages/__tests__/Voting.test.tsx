import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VotingPage } from '../Voting';
import { sessionService } from '../../services/sessionService';
import { agendaService } from '../../services/agendaService';
import { useCpfMask } from '../../hooks/useCpfMask';

vi.mock('../../services/sessionService');
vi.mock('../../services/agendaService');
vi.mock('../../hooks/useCpfMask');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

const mockUseCpfMask = () => {
  return {
    value: '',
    handleChange: vi.fn(),
    getDigits: () => '07598851080',
    isValid: () => true,
    setValue: vi.fn(),
  };
};

vi.mocked(useCpfMask).mockImplementation(mockUseCpfMask);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter initialEntries={['/votacao/1']}>{component}</MemoryRouter>);
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

  it('should render voting page with active session', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);

    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: futureDate.toISOString(),
      isActive: true,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<VotingPage />);

    await waitFor(() => {
      expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
    });
  });

  it('should show SIM and NAO buttons', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);

    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: futureDate.toISOString(),
      isActive: true,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<VotingPage />);

    await waitFor(() => {
      expect(screen.getByText('SIM')).toBeInTheDocument();
      expect(screen.getByText('NAO')).toBeInTheDocument();
    });
  });

  it('should show security notice', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);

    vi.spyOn(sessionService, 'getById').mockResolvedValue({
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: futureDate.toISOString(),
      isActive: true,
    });
    vi.spyOn(agendaService, 'getById').mockResolvedValue({
      id: 1,
      title: 'Pauta Teste',
      description: 'Descricao',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<VotingPage />);

    await waitFor(() => {
      expect(screen.getByText('Aviso de Seguranca')).toBeInTheDocument();
    });
  });
});