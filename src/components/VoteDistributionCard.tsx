import { Icon } from '@iconify/react';
import { VoteDistributionChart } from './VoteDistributionChart';
import type { VotingResult } from '../types';

interface VoteDistributionCardProps {
  result: VotingResult;
}

export function VoteDistributionCard({ result }: VoteDistributionCardProps) {
  const approvalRate = result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-[#F4F5F6] rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 bg-[#F9FAFA]/50 border-b border-[#F4F5F6]">
        <div className="flex items-center gap-3 mb-1">
          <Icon icon="lucide:pie-chart" className="w-5 h-5" />
          <h3 className="text-xl font-semibold tracking-tight">Distribuicao de Votos</h3>
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative w-full max-w-[250px] aspect-square">
          <VoteDistributionChart result={result} className="w-full h-full" />
        </div>
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-sm">SIM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-sm">NAO</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="text-[30px] font-bold text-[#0677F9]">{approvalRate}%</div>
          <div className="text-[14px] font-medium text-[#91969C] tracking-tight uppercase">Taxa de Aprovacao</div>
        </div>
      </div>
    </div>
  );
}