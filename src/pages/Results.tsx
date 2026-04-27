import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { agendaService } from '../services/agendaService';
import { sessionService } from '../services/sessionService';
import { voteService } from '../services/voteService';
import { useAppStore } from '../stores/appStore';
import type { Agenda, VotingSession, VotingResult } from '../types';

export function Results() {
  const { id } = useParams<{ id: string }>();
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [session, setSession] = useState<VotingSession | null>(null);
  const [result, setResult] = useState<VotingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAppStore();

  useEffect(() => {
    if (id) loadData();
    else loadAllResults();
  }, [id]);

  const loadData = async () => {
    try {
      const sessionData = await sessionService.getById(Number(id));
      setSession(sessionData);
      
      const agendaData = await agendaService.getById(sessionData.agendaId);
      setAgenda(agendaData);
      
      const resultData = await voteService.getResult(sessionData.id);
      setResult(resultData);
    } catch (error) {
      addToast({ type: 'error', message: 'Nao foi possivel carregar os resultados' });
    } finally {
      setLoading(false);
    }
  };

  const loadAllResults = async () => {
    try {
      const agendas = await agendaService.getAll();
      const resultsWithData: { agenda: Agenda; session?: VotingSession; result?: VotingResult }[] = [];
      
      for (const agenda of agendas) {
        try {
          const session = await sessionService.getByAgendaId(agenda.id);
          const result = await voteService.getResult(session.id);
          resultsWithData.push({ agenda, session, result });
        } catch {
          resultsWithData.push({ agenda, session: undefined, result: undefined });
        }
      }
      
      setAgendasWithResults(resultsWithData);
    } catch (error) {
      addToast({ type: 'error', message: 'Nao foi possivel carregar os resultados' });
    } finally {
      setLoading(false);
    }
  };

  const [agendasWithResults, setAgendasWithResults] = useState<{ agenda: Agenda; session?: VotingSession; result?: VotingResult }[]>([]);

  if (loading) {
    return (
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center" data-testid="loading">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0677F9]"></div>
        </div>
    );
  }

  if (!id && agendasWithResults.length > 0) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#171A1C] tracking-tight">Resultados</h1>
            <p className="text-[#91969C] mt-1">Acompanhe os resultados de todas as votacoes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agendasWithResults.map((item) => (
              <Link 
                key={item.agenda.id}
                to={`/resultados/${item.session?.id}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#F4F5F6] hover:border-[#0677F9]/10 transition-all"
              >
                <h3 className="text-lg font-semibold text-[#171A1C] mb-4 line-clamp-2">
                  {item.agenda.title}
                </h3>
                
                {item.result ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#91969C]">Total de Votos:</span>
                      <span className="font-semibold">{item.result.totalVotes}</span>
                    </div>
                    <div className="h-3 bg-[#F4F5F6] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0677F9] rounded-full" 
                        style={{ width: `${(item.result.yesVotes / item.result.totalVotes) * 100}%` }} 
                      />
                    </div>
                    <div className="text-center">
                      <span className={`text-2xl font-bold ${
                        item.result.result === 'APPROVED' ? 'text-green-600' : 
                        item.result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {item.result.result === 'APPROVED' ? 'Aprovado' : item.result.result === 'REJECTED' ? 'Rejeitado' : 'Empate'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#91969C] text-sm">Nenhum resultado disponivel.</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result || !agenda || !session) {
    return (
      <div className="flex-1 p-4 lg:p-8 flex items-center justify-center">
        <p className="text-[#91969C]">Resultado nao encontrado.</p>
      </div>
    );
  }

  const approvalRate = result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#F4F5F6] rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 bg-[#F9FAFA]/50 border-b border-[#F4F5F6]">
                <div className="flex items-center gap-3 mb-1">
                  <Icon icon="lucide:pie-chart" className="w-5 h-5" />
                  <h3 className="text-xl font-semibold tracking-tight">Distribuicao de Votos</h3>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-full max-w-[250px] aspect-square">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {result.totalVotes === 0 ? (
                      <circle
                        cx="50" cy="50" r="40"
                        fill="transparent"
                        stroke="#0677F9"
                        strokeWidth="20"
                      />
                    ) : (
                      <>
                        <circle
                          cx="50" cy="50" r="40"
                          fill="transparent"
                          stroke="#22C55E"
                          strokeWidth="20"
                          strokeDasharray={`${(result.yesVotes / result.totalVotes) * 251.2} 251.2`}
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50" cy="50" r="40"
                          fill="transparent"
                          stroke="#D92626"
                          strokeWidth="20"
                          strokeDasharray={`${(result.noVotes / result.totalVotes) * 251.2} 251.2`}
                          strokeDashoffset={`-${(result.yesVotes / result.totalVotes) * 251.2}`}
                          transform="rotate(-90 50 50)"
                        />
                      </>
                    )}
                  </svg>
                  {result.totalVotes === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[#0677F9] text-lg font-medium">Sem Votos</span>
                    </div>
                  )}
                </div>
                {result.totalVotes > 0 && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#F4F5F6] rounded-2xl p-6 lg:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0">
                <Icon
                  icon={result.result === 'APPROVED' ? 'lucide:check' : result.result === 'REJECTED' ? 'lucide:x' : 'lucide:minus'}
                  className={`w-10 h-10 ${result.result === 'APPROVED' ? 'text-green-600' : result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}
                />
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <span className="text-[#91969C] text-sm font-medium tracking-widest uppercase">Veredito Final</span>
                <h2 className={`text-4xl font-bold ${
                  result.result === 'APPROVED' ? 'text-green-600' :
                  result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {result.result === 'APPROVED' ? 'Aprovado' : result.result === 'REJECTED' ? 'Rejeitado' : 'Empate'}
                </h2>
                <p className="text-[#91969C] text-base max-w-md">
                  Estadecisao foi ratificada pelo quórum legal e entra em vigor imediatamente.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
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
                    <td className="py-4 px-6 text-right font-semibold text-green-800">
                      {result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-red-800">NAO</td>
                    <td className="py-4 px-4 text-right">{result.noVotes}</td>
                    <td className="py-4 px-6 text-right font-semibold text-red-800">
                      {result.totalVotes > 0 ? ((result.noVotes / result.totalVotes) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr className="bg-[#F9FAFA] font-bold">
                    <td className="py-5 px-6">Total</td>
                    <td className="py-5 px-4 text-right">{result.totalVotes}</td>
                    <td className="py-5 px-6 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[#F0F7FF] border border-[#0677F9]/10 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Icon icon="lucide:info" className="w-5 h-5 text-[#0677F9]" />
            <h4 className="text-sm font-bold text-[#02244B]">Notas de Conformidade e Acessibilidade</h4>
          </div>
          <ul className="space-y-2 text-sm text-[#02244B]/80">
            <li className="flex gap-3">
              <span>-</span>
              <span>Os dados apresentados cumprem os requisitos da LGPD.</span>
            </li>
            <li className="flex gap-3">
              <span>-</span>
              <span>Graficos gerados com cores de alto contraste.</span>
            </li>
            <li className="flex gap-3">
              <span>-</span>
              <span>O quórum foi validado via assinatura digital por CPF unico.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}