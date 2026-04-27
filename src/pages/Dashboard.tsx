import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { agendaService } from '../services/agendaService';
import { sessionService } from '../services/sessionService';
import { useAppStore } from '../stores/appStore';
import type { Agenda, VotingSession } from '../types';

interface AgendaWithSession extends Agenda {
  session?: VotingSession;
}

export function Dashboard() {
  const [agendas, setAgendas] = useState<AgendaWithSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAppStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await agendaService.getAll();
      const agendasWithSessions = await Promise.all(
        data.map(async (agenda) => {
          try {
            const session = await sessionService.getByAgendaId(agenda.id);
            return { ...agenda, session };
          } catch {
            return { ...agenda, session: undefined };
          }
        })
      );
      setAgendas(agendasWithSessions);
    } catch (error) {
      addToast({ type: 'error', message: 'Nao foi possivel carregar os dados' });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Pautas Totais', value: agendas.length, icon: 'lucide:file-text', color: 'bg-[#0677F9]/10 text-[#0677F9]' },
    { label: 'Sessoes Ativas', value: agendas.filter(a => a.session?.isActive).length, icon: 'lucide:play-circle', color: 'bg-[#0677F9]/10 text-[#0677F9]' },
  ];

  const getStatusBadge = (session?: VotingSession) => {
    if (!session) return { label: 'Pendente', class: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' };
    if (session.isActive) return { label: 'Ativo', class: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' };
    return { label: 'Encerrado', class: 'bg-[#F4F5F6] text-[#91969C] border-[#F4F5F6]' };
  };

  const getDotColor = (session?: VotingSession) => {
    if (!session) return 'bg-[#91969C]';
    if (session.isActive) return 'bg-[#22C55E]';
    return 'bg-[#91969C]';
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0677F9]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:px-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#171A1C] tracking-tight">Dashboard de Agendas</h1>
          <p className="text-[#91969C] mt-1">Bem-vindo. Gerencie as votacoes e acompanhe os resultados em tempo real.</p>
        </div>
        <Link 
          to="/pautas/nova"
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0677F9] text-white rounded-xl text-sm font-medium hover:bg-[#0566d6] shadow-md shadow-blue-200 self-start"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          Nova Pauta
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-[#F4F5F6] hover:border-[#0677F9]/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#91969C] mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#171A1C]">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon icon={stat.icon} className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agendas.map((agenda) => {
          const status = getStatusBadge(agenda.session);
          return (
            <div key={agenda.id} className="bg-white rounded-xl shadow-sm border border-[#F4F5F6] hover:border-[#0677F9]/10 transition-all flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${status.class}`}>
                    {status.label}
                  </span>
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
                  <div className={`w-2 h-2 rounded-full ${getDotColor(agenda.session)}`}></div>
                  <span className="text-xs font-medium text-[#171A1C]">
                    {agenda.session ? `${agenda.session.id} - ID` : 'Sem sessao'}
                  </span>
                </div>
                <Link 
                  to={`/pautas/${agenda.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-[#0677F9] hover:underline"
                >
                  Ver detalhes
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}