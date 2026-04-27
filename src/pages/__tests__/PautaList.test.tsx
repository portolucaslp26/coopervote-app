import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PautaList } from '../PautaList';
import { agendaService } from '../../services/agendaService';
import { sessionService } from '../../services/sessionService';

vi.mock('../../services/agendaService');
vi.mock('../../services/sessionService');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PautaList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.spyOn(agendaService, 'getAll').mockReturnValue(new Promise(() => {}));
    renderWithRouter(<PautaList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render agendas after loading', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([
      { id: 1, title: 'Pauta 1', description: 'Desc 1', createdAt: '2026-04-27' },
    ]);
    vi.spyOn(sessionService, 'getByAgendaId').mockRejectedValue(new Error('No session'));

    renderWithRouter(<PautaList />);

    await waitFor(() => {
      expect(screen.getByText('Pauta 1')).toBeInTheDocument();
    });
  });

  it('should show no agendas message when list is empty', async () => {
    vi.spyOn(agendaService, 'getAll').mockResolvedValue([]);
    renderWithRouter(<PautaList />);

    await waitFor(() => {
      const paragraphs = screen.getAllByText(/pautas/);
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });
});
