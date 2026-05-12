import { Icon } from '@iconify/react';
import type { Agenda } from '../types';

interface AgendaInfoProps {
  agenda: Agenda;
}

export function AgendaInfo({ agenda }: AgendaInfoProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{agenda.title}</h1>
      <div className="flex flex-wrap gap-6 text-sm text-[#91969C]">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:calendar" className="w-4 h-4" />
          {new Date(agenda.createdAt).toLocaleDateString('pt-BR')}
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="lucide:hash" className="w-4 h-4" />
          ID: #{agenda.id}
        </div>
      </div>
    </div>
  );
}