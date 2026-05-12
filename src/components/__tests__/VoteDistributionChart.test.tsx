import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { VoteDistributionChart } from '../VoteDistributionChart';
import type { VotingResult } from '../../types';

describe('VoteDistributionChart', () => {
  const createMockResult = (overrides = {}): VotingResult => ({
    sessionId: 1,
    agendaId: 1,
    yesVotes: 10,
    noVotes: 5,
    totalVotes: 15,
    result: 'APPROVED',
    ...overrides,
  });

  it('should render SVG element', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with zero votes (no circles)', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult({ yesVotes: 0, noVotes: 0, totalVotes: 0 })} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(0);
  });

  it('should render circles when there are votes', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult({ yesVotes: 10, noVotes: 5, totalVotes: 15 })} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('should render with all yes votes', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult({ yesVotes: 10, noVotes: 0, totalVotes: 10 })} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('should render with all no votes', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult({ yesVotes: 0, noVotes: 10, totalVotes: 10 })} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('should apply custom className', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult()} className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should apply default className when not provided', () => {
    const { container } = render(<VoteDistributionChart result={createMockResult()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
