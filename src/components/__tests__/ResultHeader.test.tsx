import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ResultHeader } from '../ResultHeader';
import type { Agenda, VotingSession } from '../../types';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ResultHeader', () => {
  const mockAgenda: Agenda = {
    id: 1,
    title: 'Pauta Teste',
    description: 'Descricao',
    createdAt: '2026-04-27',
  };

  const mockSession: VotingSession = {
    id: 1,
    agendaId: 1,
    startTime: '2026-04-27T10:00:00',
    endTime: '2026-04-27T11:00:00',
    isActive: false,
  };

  it('should render agenda title', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getAllByText('Pauta Teste').length).toBeGreaterThan(0);
  });

  it('should render Finalizado em text', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText(/Finalizado em/)).toBeInTheDocument();
  });

  it('should render Inicio text', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText(/Inicio:/)).toBeInTheDocument();
  });

  it('should render Fim text', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText(/Fim:/)).toBeInTheDocument();
  });

  it('should render Compartilhar button', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText('Compartilhar')).toBeInTheDocument();
  });

  it('should render Imprimir button', () => {
    renderWithRouter(<ResultHeader agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText('Imprimir')).toBeInTheDocument();
  });
});
