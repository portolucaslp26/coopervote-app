import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VoteDistributionCard } from '../VoteDistributionCard';
import type { VotingResult } from '../../types';

describe('VoteDistributionCard', () => {
  const createMockResult = (overrides = {}): VotingResult => ({
    sessionId: 1,
    agendaId: 1,
    yesVotes: 10,
    noVotes: 5,
    totalVotes: 15,
    result: 'APPROVED',
    ...overrides,
  });

  it('should render title correctly', () => {
    render(<VoteDistributionCard result={createMockResult()} />);
    expect(screen.getByText('Distribuicao de Votos')).toBeInTheDocument();
  });

  it('should display approval rate', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 10, totalVotes: 15 })} />);
    expect(screen.getByText(/66\.7%/)).toBeInTheDocument();
  });

  it('should render with zero votes', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 0, noVotes: 0, totalVotes: 0 })} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should render with 100% approval', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 10, noVotes: 0, totalVotes: 10 })} />);
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  it('should render with 0% approval', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 0, noVotes: 10, totalVotes: 10 })} />);
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should display SIM and NAO labels', () => {
    render(<VoteDistributionCard result={createMockResult()} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NAO')).toBeInTheDocument();
  });

  it('should display Taxa de Aprovacao label', () => {
    render(<VoteDistributionCard result={createMockResult()} />);
    expect(screen.getByText('Taxa de Aprovacao')).toBeInTheDocument();
  });

  it('should render chart with all yes votes', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 10, noVotes: 0, totalVotes: 10 })} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render chart with all no votes', () => {
    render(<VoteDistributionCard result={createMockResult({ yesVotes: 0, noVotes: 10, totalVotes: 10 })} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
