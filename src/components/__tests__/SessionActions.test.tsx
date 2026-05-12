import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionActions } from '../SessionActions';
import type { VotingSession } from '../../types';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SessionActions', () => {
  const mockSession: VotingSession = {
    id: 1,
    agendaId: 1,
    startTime: '2026-04-27T10:00:00',
    endTime: '2026-04-27T11:00:00',
    isActive: false,
  };

  it('should render Abrir Sessao button when no session', () => {
    const onOpenSession = vi.fn().mockResolvedValue(undefined);
    renderWithRouter(
      <SessionActions
        session={null}
        onOpenSession={onOpenSession}
        onCloseSession={vi.fn()}
        submitting={false}
      />
    );
    expect(screen.getByText('Abrir Sessao de Votacao')).toBeInTheDocument();
  });

  it('should render Ir para Votacao when session is active', () => {
    const activeSession = { ...mockSession, isActive: true };
    renderWithRouter(
      <SessionActions
        session={activeSession}
        onOpenSession={vi.fn()}
        onCloseSession={vi.fn()}
        submitting={false}
      />
    );
    expect(screen.getByText('Ir para Votacao')).toBeInTheDocument();
    expect(screen.getByText('Encerrar Sessao')).toBeInTheDocument();
  });

  it('should render Ver Resultado when session is closed', () => {
    renderWithRouter(
      <SessionActions
        session={mockSession}
        onOpenSession={vi.fn()}
        onCloseSession={vi.fn()}
        submitting={false}
      />
    );
    expect(screen.getByText('Ver Resultado')).toBeInTheDocument();
  });

  it('should show submitting state for Abrir', () => {
    renderWithRouter(
      <SessionActions
        session={null}
        onOpenSession={vi.fn()}
        onCloseSession={vi.fn()}
        submitting={true}
      />
    );
    expect(screen.getByText('Abrindo...')).toBeInTheDocument();
  });

  it('should show submitting state for Encerrar', () => {
    const activeSession = { ...mockSession, isActive: true };
    renderWithRouter(
      <SessionActions
        session={activeSession}
        onOpenSession={vi.fn()}
        onCloseSession={vi.fn()}
        submitting={true}
      />
    );
    expect(screen.getByText('Encerrando...')).toBeInTheDocument();
  });
});
