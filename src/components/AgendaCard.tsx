import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { StatusBadge } from './StatusBadge';
import type { Agenda, VotingSession } from '../types';

interface AgendaCardProps {
  agenda: Agenda;
  session?: VotingSession;
  actions?: React.ReactNode;
}

export function AgendaCard({ agenda, session, actions }: AgendaCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#F4F5F6] hover:border-[#0677F9]/10 transition-all flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge session={session} />
          <span className="text-[10px] font-medium text-[#91969C] uppercase tracking-tight">
            {new Date(agenda.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-[#171A1C] mb-2 leading-tight">
          {agenda.title}
        </h4>
        <p className="text-sm text-[#91969C] leading-relaxed line-clamp-2">
          {agenda.description}
        </p>
      </div>

      <div className="bg-[#F9FAFA]/50 border-t border-[#F4F5F6] p-4 flex items-center justify-between rounded-b-xl">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${session?.isActive ? 'bg-green-500' : 'bg-[#91969C]'}`}></div>
          <span className="text-xs font-medium text-[#171A1C]">
            {session ? `${session.id} - ID` : 'Sem sessao'}
          </span>
        </div>
        {actions || (
          <Link
            to={`/pautas/${agenda.id}`}
            className="flex items-center gap-1 text-sm font-medium text-[#0677F9] hover:underline"
          >
            Ver detalhes
            <Icon icon="lucide:arrow-right" className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}