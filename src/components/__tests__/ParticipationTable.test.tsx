import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParticipationTable } from '../ParticipationTable';
import type { VotingResult } from '../../types';

describe('ParticipationTable', () => {
  const createMockResult = (overrides = {}): VotingResult => ({
    sessionId: 1,
    agendaId: 1,
    yesVotes: 10,
    noVotes: 5,
    totalVotes: 15,
    result: 'APPROVED',
    ...overrides,
  });

  it('should render table headers correctly', () => {
    render(<ParticipationTable result={createMockResult()} />);
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Votos')).toBeInTheDocument();
    expect(screen.getByText('Percentual')).toBeInTheDocument();
  });

  it('should display SIM row with correct values', () => {
    render(<ParticipationTable result={createMockResult({ yesVotes: 10, totalVotes: 15 })} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should display NAO row with correct values', () => {
    render(<ParticipationTable result={createMockResult({ noVotes: 5, totalVotes: 15 })} />);
    expect(screen.getByText('NAO')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display Total row', () => {
    render(<ParticipationTable result={createMockResult({ totalVotes: 15 })} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getAllByText('100%').length).toBe(1);
  });

  it('should render with zero votes', () => {
    render(<ParticipationTable result={createMockResult({ yesVotes: 0, noVotes: 0, totalVotes: 0 })} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NAO')).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('should render with all yes votes', () => {
    render(<ParticipationTable result={createMockResult({ yesVotes: 10, noVotes: 0, totalVotes: 10 })} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NAO')).toBeInTheDocument();
  });

  it('should render with all no votes', () => {
    render(<ParticipationTable result={createMockResult({ yesVotes: 0, noVotes: 10, totalVotes: 10 })} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NAO')).toBeInTheDocument();
  });

  it('should have correct title', () => {
    render(<ParticipationTable result={createMockResult()} />);
    expect(screen.getByText('Resumo de Participacao')).toBeInTheDocument();
  });
});
