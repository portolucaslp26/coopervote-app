import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AgendaCard } from '../AgendaCard';
import type { Agenda, VotingSession } from '../../types';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AgendaCard', () => {
  const mockAgenda: Agenda = {
    id: 1,
    title: 'Pauta Teste',
    description: 'Descricao da pauta',
    createdAt: '2026-04-27',
  };

  const mockSession: VotingSession = {
    id: 1,
    agendaId: 1,
    startTime: '2026-04-27T10:00:00',
    endTime: '2026-04-27T11:00:00',
    isActive: true,
  };

  it('should render agenda title', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} />);
    expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
  });

  it('should render agenda description', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} />);
    expect(screen.getByText('Descricao da pauta')).toBeInTheDocument();
  });

  it('should render Ver detalhes link when no actions provided', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} />);
    expect(screen.getByText('Ver detalhes')).toBeInTheDocument();
  });

  it('should render with session', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText('1 - ID')).toBeInTheDocument();
  });

  it('should render Sem sessao when no session provided', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} />);
    expect(screen.getByText('Sem sessao')).toBeInTheDocument();
  });

  it('should render Pendente badge when no session', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('should render Ativo badge when session is active', () => {
    renderWithRouter(<AgendaCard agenda={mockAgenda} session={mockSession} />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('should render Encerrado badge when session is not active', () => {
    const closedSession = { ...mockSession, isActive: false };
    renderWithRouter(<AgendaCard agenda={mockAgenda} session={closedSession} />);
    expect(screen.getByText('Encerrado')).toBeInTheDocument();
  });
});
