import { StatusBadge } from './StatusBadge';
import type { VotingSession } from '../types';

interface SessionStatusCardProps {
  session: VotingSession | null;
}

export function SessionStatusCard({ session }: SessionStatusCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
      <h3 className="text-sm font-semibold text-[#91969C] mb-4">Status da Sessao</h3>
      <StatusBadge session={session} />

      {session && (
        <div className="mt-4 space-y-2 text-sm text-[#91969C]">
          <div className="flex justify-between">
            <span>Inicio:</span>
            <span>{new Date(session.startTime).toLocaleString('pt-BR')}</span>
          </div>
          {session.endTime && (
            <div className="flex justify-between">
              <span>Fim:</span>
              <span>{new Date(session.endTime).toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}