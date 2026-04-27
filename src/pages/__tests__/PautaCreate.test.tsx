import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PautaCreate } from '../PautaCreate';
import { agendaService } from '../../services/agendaService';

vi.mock('../../services/agendaService');

const mockNavigate = vi.fn();
const mockAddToast = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../stores/appStore', () => ({
  useAppStore: () => ({
    addToast: mockAddToast,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PautaCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create form', () => {
    renderWithRouter(<PautaCreate />);
    expect(screen.getByText('Criar Nova Pauta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: Aprovacao/)).toBeInTheDocument();
  });

  it('should show error when title is empty', async () => {
    renderWithRouter(<PautaCreate />);
    const submitButton = screen.getByText('Criar Pauta');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'O titulo e obrigatorio',
      });
    });
  });

  it('should create agenda when form is submitted', async () => {
    vi.spyOn(agendaService, 'create').mockResolvedValue({
      id: 1,
      title: 'Nova Pauta',
      description: 'Desc',
      createdAt: '2026-04-27',
    });

    renderWithRouter(<PautaCreate />);

    fireEvent.change(screen.getByPlaceholderText(/Ex: Aprovacao/), {
      target: { value: 'Nova Pauta' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Descreva os pontos/), {
      target: { value: 'Desc' },
    });

    fireEvent.click(screen.getByText('Criar Pauta'));

    await waitFor(() => {
      expect(agendaService.create).toHaveBeenCalledWith({
        title: 'Nova Pauta',
        description: 'Desc',
      });
    });
  });
});
