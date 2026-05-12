import type { VotingResult } from '../types';

interface VoteDistributionChartProps {
  result: VotingResult;
  className?: string;
}

export function VoteDistributionChart({ result, className = '' }: VoteDistributionChartProps) {
  const yesPercentage = result.totalVotes > 0 ? (result.yesVotes / result.totalVotes) * 100 : 0;
  const noPercentage = result.totalVotes > 0 ? (result.noVotes / result.totalVotes) * 100 : 0;

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
            strokeDasharray={`${yesPercentage * 2.512} 251.2`}
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#D92626"
            strokeWidth="20"
            strokeDasharray={`${noPercentage * 2.512} 251.2`}
            strokeDashoffset={`-${yesPercentage * 2.512}`}
            transform="rotate(-90 50 50)"
          />
        </>
      )}
    </svg>
  );
}