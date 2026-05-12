export function calculatePercentage(yesVotes: number, noVotes: number, totalVotes: number): { yes: number; no: number } {
  if (totalVotes === 0) {
    return { yes: 0, no: 0 };
  }
  return {
    yes: (yesVotes / totalVotes) * 100,
    no: (noVotes / totalVotes) * 100,
  };
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function getApprovalRate(yesVotes: number, totalVotes: number): string {
  if (totalVotes === 0) return '0';
  return ((yesVotes / totalVotes) * 100).toFixed(1);
}
