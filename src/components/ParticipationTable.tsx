import { Icon } from '@iconify/react';
import type { VotingResult } from '../types';

interface ParticipationTableProps {
  result: VotingResult;
}

export function ParticipationTable({ result }: ParticipationTableProps) {
  const yesPercentage = result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0;
  const noPercentage = result.totalVotes > 0 ? ((result.noVotes / result.totalVotes) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-[#F4F5F6] rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 bg-[#F9FAFA]/50 border-b border-[#F4F5F6]">
        <div className="flex items-center gap-3 mb-1">
          <Icon icon="lucide:users" className="w-5 h-5" />
          <h3 className="text-xl font-semibold tracking-tight">Resumo de Participacao</h3>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#91969C] font-medium border-b border-[#F4F5F6]">
            <th className="text-left py-4 px-6">Categoria</th>
            <th className="text-right py-4 px-4">Votos</th>
            <th className="text-right py-4 px-6">Percentual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4F5F6]">
          <tr>
            <td className="py-4 px-6 font-medium text-green-800">SIM</td>
            <td className="py-4 px-4 text-right">{result.yesVotes}</td>
            <td className="py-4 px-6 text-right font-semibold text-green-800">{yesPercentage}%</td>
          </tr>
          <tr>
            <td className="py-4 px-6 font-medium text-red-800">NAO</td>
            <td className="py-4 px-4 text-right">{result.noVotes}</td>
            <td className="py-4 px-6 text-right font-semibold text-red-800">{noPercentage}%</td>
          </tr>
          <tr className="bg-[#F9FAFA] font-bold">
            <td className="py-5 px-6">Total</td>
            <td className="py-5 px-4 text-right">{result.totalVotes}</td>
            <td className="py-5 px-6 text-right">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}