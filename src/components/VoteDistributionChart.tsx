import type { VotingResult } from '../types';
import { calculatePercentage } from '../utils';

interface VoteDistributionChartProps {
  result: VotingResult;
  className?: string;
}

export function VoteDistributionChart({ result, className = '' }: VoteDistributionChartProps) {
  const { yes, no } = calculatePercentage(result.yesVotes, result.noVotes, result.totalVotes);

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {result.totalVotes > 0 && (
        <>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#22C55E"
            strokeWidth="20"
            strokeDasharray={`${yes * 2.512} 251.2`}
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#D92626"
            strokeWidth="20"
            strokeDasharray={`${no * 2.512} 251.2`}
            strokeDashoffset={`-${yes * 2.512}`}
            transform="rotate(-90 50 50)"
          />
        </>
      )}
    </svg>
  );
}