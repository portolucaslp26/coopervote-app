import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/StatusBadge';
import type { VotingSession } from '../types';

describe('StatusBadge', () => {
  it('renders "Pendente" when session is undefined', () => {
    render(<StatusBadge session={undefined} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders "Pendente" when session is null', () => {
    render(<StatusBadge session={null as unknown as undefined} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders "Ativo" when session is active', () => {
    const activeSession: VotingSession = {
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: '',
      isActive: true,
    };
    render(<StatusBadge session={activeSession} />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('renders "Encerrado" when session is not active', () => {
    const closedSession: VotingSession = {
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      isActive: false,
    };
    render(<StatusBadge session={closedSession} />);
    expect(screen.getByText('Encerrado')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const activeSession: VotingSession = {
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: '',
      isActive: true,
    };
    const { container } = render(<StatusBadge session={activeSession} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has correct styling classes for pending status', () => {
    render(<StatusBadge session={undefined} />);
    const badge = screen.getByText('Pendente');
    expect(badge.className).toContain('bg-amber-50');
    expect(badge.className).toContain('text-amber-700');
    expect(badge.className).toContain('border-amber-200');
  });

  it('has correct styling classes for active status', () => {
    const activeSession: VotingSession = {
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: '',
      isActive: true,
    };
    render(<StatusBadge session={activeSession} />);
    const badge = screen.getByText('Ativo');
    expect(badge.className).toContain('bg-green-50');
    expect(badge.className).toContain('text-green-700');
    expect(badge.className).toContain('border-green-200');
  });

  it('has correct styling classes for closed status', () => {
    const closedSession: VotingSession = {
      id: 1,
      agendaId: 1,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      isActive: false,
    };
    render(<StatusBadge session={closedSession} />);
    const badge = screen.getByText('Encerrado');
    expect(badge.className).toContain('bg-gray-100');
    expect(badge.className).toContain('text-gray-600');
    expect(badge.className).toContain('border-gray-200');
  });
});