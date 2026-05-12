import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerdictBanner } from '../VerdictBanner';
import type { VotingResult } from '../../types';

describe('VerdictBanner', () => {
  const createMockResult = (result: 'APPROVED' | 'REJECTED' | 'DRAW'): VotingResult => ({
    sessionId: 1,
    agendaId: 1,
    yesVotes: 10,
    noVotes: 5,
    totalVotes: 15,
    result,
  });

  it('should render Aprovado for APPROVED result', () => {
    render(<VerdictBanner result={createMockResult('APPROVED')} />);
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('should render Rejeitado for REJECTED result', () => {
    render(<VerdictBanner result={createMockResult('REJECTED')} />);
    expect(screen.getByText('Rejeitado')).toBeInTheDocument();
  });

  it('should render Empate for DRAW result', () => {
    render(<VerdictBanner result={createMockResult('DRAW')} />);
    expect(screen.getByText('Empate')).toBeInTheDocument();
  });

  it('should render Veredito Final label', () => {
    render(<VerdictBanner result={createMockResult('APPROVED')} />);
    expect(screen.getByText('Veredito Final')).toBeInTheDocument();
  });

  it('should render ratification text', () => {
    render(<VerdictBanner result={createMockResult('APPROVED')} />);
    expect(screen.getByText(/ratificada pelo quorum legal/)).toBeInTheDocument();
  });
});
