import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionStatusCard } from '../SessionStatusCard';
import type { VotingSession } from '../../types';

describe('SessionStatusCard', () => {
  const mockSession: VotingSession = {
    id: 1,
    agendaId: 1,
    startTime: '2026-04-27T10:00:00',
    endTime: '2026-04-27T11:00:00',
    isActive: false,
  };

  it('should render title', () => {
    render(<SessionStatusCard session={mockSession} />);
    expect(screen.getByText('Status da Sessao')).toBeInTheDocument();
  });

  it('should render session times', () => {
    render(<SessionStatusCard session={mockSession} />);
    expect(screen.getByText(/Inicio:/)).toBeInTheDocument();
    expect(screen.getByText(/Fim:/)).toBeInTheDocument();
  });

  it('should render Pendente when session is null', () => {
    render(<SessionStatusCard session={null} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('should render Ativo when session is active', () => {
    const activeSession = { ...mockSession, isActive: true };
    render(<SessionStatusCard session={activeSession} />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('should render Encerrado when session is not active', () => {
    render(<SessionStatusCard session={mockSession} />);
    expect(screen.getByText('Encerrado')).toBeInTheDocument();
  });
});
