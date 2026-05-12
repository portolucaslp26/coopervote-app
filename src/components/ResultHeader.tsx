import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { Agenda, VotingSession } from '../types';

interface ResultHeaderProps {
  agenda: Agenda;
  session: VotingSession;
}

export function ResultHeader({ agenda, session }: ResultHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#91969C] tracking-widest uppercase">
          <Link to="/resultados" className="hover:text-[#0677F9]">Resultados</Link>
          <Icon icon="lucide:chevron-right" className="w-3 h-3" />
          <span>{agenda.title}</span>
        </div>
        <h1 className="text-2xl lg:text-[30px] leading-tight font-bold tracking-tight">
          {agenda.title}
        </h1>
        <div className="flex items-center gap-2 text-[#91969C] text-sm">
          <Icon icon="lucide:clock" className="w-4 h-4" />
          <span>Finalizado em {new Date(session.endTime).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#91969C]">
          <span className="flex items-center gap-1">
            <Icon icon="lucide:play" className="w-3 h-3" />
            Inicio: {new Date(session.startTime).toLocaleString('pt-BR')}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="lucide:stop-circle" className="w-3 h-3" />
            Fim: {new Date(session.endTime).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[#DEE0E3] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Icon icon="lucide:share" className="w-4 h-4" />
          Compartilhar
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[#DEE0E3] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <Icon icon="lucide:printer" className="w-4 h-4" />
          Imprimir
        </button>
      </div>
    </div>
  );
}