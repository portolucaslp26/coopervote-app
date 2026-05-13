import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { VotingPage } from '../Voting';
import { sessionService } from '../../services/sessionService';
import { agendaService } from '../../services/agendaService';
import { voteService } from '../../services/voteService';
import { useCpfMask } from '../../hooks/useCpfMask';
import { useAppStore } from '../../stores/appStore';

vi.mock('../../services/sessionService');
vi.mock('../../services/agendaService');
vi.mock('../../services/voteService');
vi.mock('../../hooks/useCpfMask');
vi.mock('../../stores/appStore');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: vi.fn(),
  };
});

const mockAddToast = vi.fn();
const mockNavigate = vi.fn();

vi.mocked(useNavigate).mockReturnValue(mockNavigate);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter initialEntries={['/votacao/1']}>{component}</MemoryRouter>);
};

const createActiveSession = () => {
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 2);
  return {
    id: 1,
    agendaId: 1,
    startTime: new Date().toISOString(),
    endTime: futureDate.toISOString(),
    isActive: true,
  };
};

const createAgenda = () => ({
  id: 1,
  title: 'Pauta Teste',
  description: 'Descricao da pauta',
  createdAt: '2026-04-27',
});

const validCpfMock = () => ({
  value: '075.988.510-80',
  handleChange: vi.fn(),
  getDigits: () => '07598851080',
  isValid: () => true,
  setValue: vi.fn(),
});

const invalidCpfMock = () => ({
  value: '123',
  handleChange: vi.fn(),
  getDigits: () => '123',
  isValid: () => false,
  setValue: vi.fn(),
});

const mockAppStore = () => ({
  addToast: mockAddToast,
  toasts: [],
  agendas: [],
  currentAgenda: null,
  currentSession: null,
  isLoading: false,
  error: null,
  setAgendas: vi.fn(),
  setCurrentAgenda: vi.fn(),
  setCurrentSession: vi.fn(),
  removeToast: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
});

describe('VotingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCpfMask).mockImplementation(validCpfMock);
    vi.mocked(useAppStore).mockImplementation(mockAppStore);
  });

  const setupActiveSession = async () => {
    vi.spyOn(sessionService, 'getById').mockResolvedValue(createActiveSession());
    vi.spyOn(agendaService, 'getById').mockResolvedValue(createAgenda());
    renderWithRouter(<VotingPage />);
    await waitFor(() => {
      expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
    });
  };

  describe('loading and initial states', () => {
    it('should show loading state initially', () => {
      vi.spyOn(sessionService, 'getById').mockReturnValue(new Promise(() => {}));
      vi.mocked(useCpfMask).mockImplementation(validCpfMock);
      vi.mocked(useAppStore).mockImplementation(mockAppStore);
      renderWithRouter(<VotingPage />);
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('session validation', () => {
    it('should navigate to /pautas when session fetch fails', async () => {
      vi.spyOn(sessionService, 'getById').mockRejectedValue(new Error('Network error'));
      vi.mocked(useAppStore).mockImplementation(mockAppStore);
      renderWithRouter(<VotingPage />);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/pautas');
      });
      expect(mockAddToast).toHaveBeenCalledWith({ type: 'error', message: 'Erro ao carregar sessao' });
    });

    it('should navigate to /pautas when session is expired', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      vi.spyOn(sessionService, 'getById').mockResolvedValue({
        id: 1,
        agendaId: 1,
        startTime: new Date().toISOString(),
        endTime: pastDate.toISOString(),
        isActive: true,
      });
      vi.mocked(useAppStore).mockImplementation(mockAppStore);
      renderWithRouter(<VotingPage />);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/pautas');
      });
      expect(mockAddToast).toHaveBeenCalledWith({ type: 'warning', message: 'Sessao ja foi encerrada' });
    });

    it('should navigate to /pautas when session is inactive', async () => {
      vi.spyOn(sessionService, 'getById').mockResolvedValue({
        id: 1,
        agendaId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60000).toISOString(),
        isActive: false,
      });
      vi.mocked(useAppStore).mockImplementation(mockAppStore);
      renderWithRouter(<VotingPage />);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/pautas');
      });
      expect(mockAddToast).toHaveBeenCalledWith({ type: 'warning', message: 'Sessao ja foi encerrada' });
    });
  });

  describe('rendering voting page', () => {
    it('should render voting page with active session', async () => {
      await setupActiveSession();
    });

    it('should show SIM and NAO buttons', async () => {
      await setupActiveSession();
      expect(screen.getByText('SIM')).toBeInTheDocument();
      expect(screen.getByText('NAO')).toBeInTheDocument();
    });

    it('should show security notice', async () => {
      await setupActiveSession();
      expect(screen.getByText('Aviso de Seguranca')).toBeInTheDocument();
    });
  });

  describe('CPF validation', () => {
    it('should show error toast when CPF is invalid on vote click', async () => {
      vi.mocked(useCpfMask).mockImplementation(invalidCpfMock);
      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      expect(mockAddToast).toHaveBeenCalledWith({ type: 'error', message: 'CPF invalido. Digite 11 digitos.' });
    });
  });

  describe('vote confirmation modal', () => {
    it('should open confirm modal when clicking SIM with valid CPF', async () => {
      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });
      expect(screen.getByText(/Tem certeza que deseja votar "SIM"/)).toBeInTheDocument();
    });

    it('should open confirm modal when clicking NAO with valid CPF', async () => {
      await setupActiveSession();

      const naoButton = screen.getByText('NAO');
      fireEvent.click(naoButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });
      expect(screen.getByText(/Tem certeza que deseja votar "NAO"/)).toBeInTheDocument();
    });

    it('should close modal and reset pending vote on cancel', async () => {
      await setupActiveSession();

      const naoButton = screen.getByText('NAO');
      fireEvent.click(naoButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Confirmar Voto' })).not.toBeInTheDocument();
      });
    });

    it('should have danger variant for NAO button in confirm modal', async () => {
      await setupActiveSession();

      const naoButton = screen.getByText('NAO');
      fireEvent.click(naoButton);

      await waitFor(() => {
        const confirmBtn = screen.getByRole('button', { name: 'Confirmar Voto' });
        expect(confirmBtn.className).toContain('bg-red-600');
      });
    });

    it('should have primary variant for SIM button in confirm modal', async () => {
      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        const confirmBtn = screen.getByRole('button', { name: 'Confirmar Voto' });
        expect(confirmBtn.className).toContain('bg-[#0677F9]');
      });
    });
  });

  describe('vote submission', () => {
    it('should show success screen after successful vote', async () => {
      vi.spyOn(voteService, 'cast').mockResolvedValue({
        id: 1,
        sessionId: 1,
        associateCpf: '07598851080',
        voteValue: true,
        createdAt: new Date().toISOString(),
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Voto Confirmado!')).toBeInTheDocument();
      });
      expect(mockAddToast).toHaveBeenCalledWith({ type: 'success', message: 'Voto registrado com sucesso!' });
    });

    it('should show warning toast on 409 error (already voted)', async () => {
      vi.spyOn(voteService, 'cast').mockRejectedValue({
        response: {
          status: 409,
          data: { detail: 'Voce ja votou nesta sessao' },
        },
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Voto Confirmado!')).not.toBeInTheDocument();
      });
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'warning',
        message: 'Voce ja votou nesta sessao',
      });
    });

    it('should show warning toast on 422 error (vote not allowed)', async () => {
      vi.spyOn(voteService, 'cast').mockRejectedValue({
        response: {
          status: 422,
          data: { title: 'Voto nao permitido' },
        },
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Voto Confirmado!')).not.toBeInTheDocument();
      });
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'warning',
        message: 'Voto nao permitido',
      });
    });

    it('should show error toast with detail message on other errors', async () => {
      vi.spyOn(voteService, 'cast').mockRejectedValue({
        response: {
          status: 500,
          data: { detail: 'Erro interno do servidor' },
        },
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Voto Confirmado!')).not.toBeInTheDocument();
      });
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Erro interno do servidor',
      });
    });

    it('should show error toast with title message when detail is not present', async () => {
      vi.spyOn(voteService, 'cast').mockRejectedValue({
        response: {
          status: 400,
          data: { title: 'CPF nao encontrado' },
        },
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Voto Confirmado!')).not.toBeInTheDocument();
      });
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'CPF nao encontrado',
      });
    });

    it('should show link to go back to pautas on success screen', async () => {
      vi.spyOn(voteService, 'cast').mockResolvedValue({
        id: 1,
        sessionId: 1,
        associateCpf: '07598851080',
        voteValue: true,
        createdAt: new Date().toISOString(),
      });

      await setupActiveSession();

      const simButton = screen.getByText('SIM');
      fireEvent.click(simButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Confirmar Voto' })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Confirmar Voto' });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        const link = screen.getByText('Voltar para Pautas');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/pautas');
      });
    });
  });
});