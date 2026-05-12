import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VotingResultCard } from '../VotingResultCard';
import type { VotingResult } from '../../types';

describe('VotingResultCard', () => {
  const createMockResult = (overrides = {}): VotingResult => ({
    sessionId: 1,
    agendaId: 1,
    yesVotes: 10,
    noVotes: 5,
    totalVotes: 15,
    result: 'APPROVED',
    ...overrides,
  });

  it('should render Resultado heading', () => {
    render(<VotingResultCard result={createMockResult()} />);
    expect(screen.getByText('Resultado')).toBeInTheDocument();
  });

  it('should display Aprovado for APPROVED result', () => {
    render(<VotingResultCard result={createMockResult({ result: 'APPROVED' })} />);
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('should display Rejeitado for REJECTED result', () => {
    render(<VotingResultCard result={createMockResult({ result: 'REJECTED' })} />);
    expect(screen.getByText('Rejeitado')).toBeInTheDocument();
  });

  it('should display Empate for DRAW result', () => {
    render(<VotingResultCard result={createMockResult({ result: 'DRAW' })} />);
    expect(screen.getByText('Empate')).toBeInTheDocument();
  });

  it('should display vote counts', () => {
    render(<VotingResultCard result={createMockResult({ yesVotes: 10, noVotes: 5, totalVotes: 15 })} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should display zero votes correctly', () => {
    render(<VotingResultCard result={createMockResult({ yesVotes: 0, noVotes: 0, totalVotes: 0 })} />);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('should display Taxa de Aprovacao label', () => {
    render(<VotingResultCard result={createMockResult()} />);
    expect(screen.getByText('Taxa de Aprovacao')).toBeInTheDocument();
  });

  it('should display Votos SIM and Votos NAO labels', () => {
    render(<VotingResultCard result={createMockResult()} />);
    expect(screen.getByText('Votos SIM')).toBeInTheDocument();
    expect(screen.getByText('Votos NAO')).toBeInTheDocument();
  });

  it('should display Total row', () => {
    render(<VotingResultCard result={createMockResult()} />);
    expect(screen.getAllByText('Total').length).toBe(1);
  });

  it('should display 100% in Total row', () => {
    render(<VotingResultCard result={createMockResult()} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
