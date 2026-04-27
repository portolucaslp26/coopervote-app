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

export function PautaList() {
  const [agendas, setAgendas] = useState<AgendaWithSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useAppStore();

  useEffect(() => {
    loadAgendas();
  }, []);

  const loadAgendas = async () => {
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
      addToast({ type: 'error', message: 'Nao foi possivel carregar as pautas' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (session?: VotingSession) => {
    if (!session) return { label: 'Pendente', class: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' };
    if (session.isActive) return { label: 'Ativo', class: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' };
    return { label: 'Encerrado', class: 'bg-[#F4F5F6] text-[#91969C] border-[#F4F5F6]' };
  };

  const filteredAgendas = agendas.filter((agenda) =>
    agenda.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agenda.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex-1 p-4 lg:p-12 flex items-center justify-center" data-testid="loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0677F9]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-12 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[30px] font-semibold text-[#171A1C] tracking-[-0.75px]">Lista de Pautas</h1>
            <p className="text-[#91969C] text-[16px] mt-1">Gerencie e acompanhamento o historico de todas as votacoes cooperatives.</p>
          </div>
          <Link 
            to="/pautas/nova"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0677F9] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all font-medium"
          >
            <Icon icon="lucide:plus" className="w-5 h-5" />
            Nova Pauta
          </Link>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icon icon="lucide:search" className="w-4 h-4 text-[#91969C]" />
            </div>
            <input 
              type="text" 
              placeholder="Pesquisar por titulo da pauta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F4F5F6] rounded-xl text-[14px] outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="bg-white border border-[#F4F5F6] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F5F6]/30 border-b border-[#F4F5F6]">
                  <th className="px-6 py-4 text-[14px] font-semibold text-[#171A1C]">Titulo</th>
                  <th className="px-4 py-4 text-[14px] font-semibold text-[#171A1C]">Data</th>
                  <th className="px-4 py-4 text-[14px] font-semibold text-[#171A1C]">Status</th>
                  <th className="px-4 py-4 text-[14px] font-semibold text-[#171A1C] text-center">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F5F6]">
                {filteredAgendas.map((agenda) => {
                  const status = getStatusBadge(agenda.session);
                  return (
                    <tr key={agenda.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-5 text-[14px] font-medium text-[#171A1C]">
                        <div>
                          <div>{agenda.title}</div>
                          {agenda.description && (
                            <div className="text-[12px] text-[#91969C] mt-1">{agenda.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-[14px] text-[#91969C]">
                        {new Date(agenda.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-3 py-0.5 rounded-full text-[12px] font-semibold border ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <Link 
                          to={`/pautas/${agenda.id}`}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                        >
                          <Icon icon="lucide:eye" className="w-5 h-5 text-[#91969C]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#91969C]">
            Mostrando <span className="font-medium text-[#171A1C]">1-{filteredAgendas.length}</span> de <span className="font-medium text-[#171A1C]">{agendas.length}</span> pautas
          </p>
        </div>
      </div>
    </div>
  );
}