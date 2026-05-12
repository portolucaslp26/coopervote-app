import { motion } from 'framer-motion';
import { VoteDistributionChart } from './VoteDistributionChart';
import type { VotingResult } from '../types';

interface VotingResultCardProps {
  result: VotingResult;
}

export function VotingResultCard({ result }: VotingResultCardProps) {
  const yesPercentage = result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0;
  const noPercentage = result.totalVotes > 0 ? ((result.noVotes / result.totalVotes) * 100).toFixed(1) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Resultado</h2>
        <span className={`text-lg font-bold ${
          result.result === 'APPROVED' ? 'text-green-600' :
          result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {result.result === 'APPROVED' ? 'Aprovado' : result.result === 'REJECTED' ? 'Rejeitado' : 'Empate'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
        <div className="relative w-32 h-32 shrink-0">
          <VoteDistributionChart result={result} className="w-full h-full" />
        </div>
        <div className="flex-1 w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#91969C] border-b border-gray-100">
                <th className="text-left py-2">Categoria</th>
                <th className="text-right py-2">Votos</th>
                <th className="text-right py-2">Percentual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-2 font-medium text-green-600">Votos SIM</td>
                <td className="py-2 text-right">{result.yesVotes}</td>
                <td className="py-2 text-right font-semibold text-green-600">{yesPercentage}%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-red-600">Votos NAO</td>
                <td className="py-2 text-right">{result.noVotes}</td>
                <td className="py-2 text-right font-semibold text-red-600">{noPercentage}%</td>
              </tr>
              <tr className="bg-gray-50 font-bold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">{result.totalVotes}</td>
                <td className="py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center p-4 bg-gray-50 rounded-xl">
        <div className="text-3xl font-bold text-[#0677F9]">{yesPercentage}%</div>
        <div className="text-xs text-[#91969C] uppercase">Taxa de Aprovacao</div>
      </div>
    </motion.section>
  );
}