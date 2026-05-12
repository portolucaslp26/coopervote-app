import { Icon } from '@iconify/react';
import type { VotingResult } from '../types';

interface VerdictBannerProps {
  result: VotingResult;
}

export function VerdictBanner({ result }: VerdictBannerProps) {
  const icon = result.result === 'APPROVED' ? 'lucide:check' : result.result === 'REJECTED' ? 'lucide:x' : 'lucide:minus';
  const colorClass = result.result === 'APPROVED' ? 'text-green-600' : result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600';

  return (
    <div className="bg-white border border-[#F4F5F6] rounded-2xl p-6 lg:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0">
        <Icon icon={icon} className={`w-10 h-10 ${colorClass}`} />
      </div>
      <div className="flex-1 text-center md:text-left space-y-2">
        <span className="text-[#91969C] text-sm font-medium tracking-widest uppercase">Veredito Final</span>
        <h2 className={`text-4xl font-bold ${colorClass}`}>
          {result.result === 'APPROVED' ? 'Aprovado' : result.result === 'REJECTED' ? 'Rejeitado' : 'Empate'}
        </h2>
        <p className="text-[#91969C] text-base max-w-md">
          Estadecisao foi ratificada pelo quorum legal e entra em vigor imediatamente.
        </p>
      </div>
    </div>
  );
}