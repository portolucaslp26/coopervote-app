import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { agendaService } from '../services/agendaService';
import { sessionService } from '../services/sessionService';
import { voteService } from '../services/voteService';
import { useAppStore } from '../stores/appStore';
import { ConfirmModal } from '../components/ConfirmModal';
import type { Agenda, VotingSession, VotingResult } from '../types';

export function PautaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [session, setSession] = useState<VotingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VotingResult | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const { addToast } = useAppStore();

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const agendaData = await agendaService.getById(Number(id));
      setAgenda(agendaData);
      
      try {
        const sessionData = await sessionService.getByAgendaId(Number(id));
        setSession(sessionData);
        
        if (!sessionData.isActive) {
          try {
            const resultData = await voteService.getResult(sessionData.id);
            setResult(resultData);
          } catch {}
        }
      } catch {
        setSession(null);
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Nao foi possivel carregar a pauta' });
      navigate('/pautas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = async (duration: number = 1) => {
    setSubmitting(true);
    try {
      const sessionData = await sessionService.open(Number(id), { durationMinutes: duration });
      setSession(sessionData);
      addToast({ type: 'success', message: 'Sessao de votacao aberta com sucesso!' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.detail || error.response?.data?.title || 'Nao foi possivel abrir a sessao' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSessionClick = () => {
    setConfirmCloseOpen(true);
  };

  const handleConfirmClose = async () => {
    setConfirmCloseOpen(false);
    setSubmitting(true);
    try {
      const sessionData = await sessionService.close(session!.id);
      setSession(sessionData);
      addToast({ type: 'success', message: 'Sessao de votacao encerrada com sucesso!' });
      
      const resultData = await voteService.getResult(sessionData.id);
      setResult(resultData);
    } catch (error) {
      addToast({ type: 'error', message: 'Erro ao encerrar sessao' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClose = () => {
    setConfirmCloseOpen(false);
  };

  if (loading || !agenda) {
    return (
      <div className="flex-1 p-4 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0677F9]"></div>
      </div>
    );
  }

  const status = session 
    ? session.isActive 
      ? { label: 'Ativo', class: 'bg-green-50 text-green-700 border-green-200' }
      : { label: 'Encerrado', class: 'bg-gray-100 text-gray-600 border-gray-200' }
    : { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' };

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/pautas')}
          className="flex items-center gap-2 text-[#91969C] text-sm font-medium mb-6 hover:text-[#171A1C]"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Voltar para Listagem
        </motion.button>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-50"
            >
              <h2 className="text-lg font-semibold mb-4">Descricao da Proposta</h2>
              <p className="text-[#525252] leading-relaxed">
                {agenda.description || 'Nenhuma descricao fornecida.'}
              </p>
            </motion.section>

{result && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Resultado</h2>
                  <span className={`text-lg font-bold ${result.result === 'APPROVED' ? 'text-green-600' : result.result === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {result.result === 'APPROVED' ? 'Aprovado' : result.result === 'REJECTED' ? 'Rejeitado' : 'Empate'}
                  </span>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {result.totalVotes > 0 && (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22C55E" strokeWidth="20" strokeDasharray={`${(result.yesVotes / result.totalVotes) * 251.2} 251.2`} transform="rotate(-90 50 50)" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D92626" strokeWidth="20" strokeDasharray={`${(result.noVotes / result.totalVotes) * 251.2} 251.2`} strokeDashoffset={`-${(result.yesVotes / result.totalVotes) * 251.2}`} transform="rotate(-90 50 50)" />
                        </>
                      )}
                    </svg>
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
                          <td className="py-2 text-right font-semibold text-green-600">{result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0}%</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-red-600">Votos NAO</td>
                          <td className="py-2 text-right">{result.noVotes}</td>
                          <td className="py-2 text-right font-semibold text-red-600">{result.totalVotes > 0 ? ((result.noVotes / result.totalVotes) * 100).toFixed(1) : 0}%</td>
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
                  <div className="text-3xl font-bold text-[#0677F9]">{result.totalVotes > 0 ? ((result.yesVotes / result.totalVotes) * 100).toFixed(1) : 0}%</div>
                  <div className="text-xs text-[#91969C] uppercase">Taxa de Aprovacao</div>
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-50"
            >
              <h3 className="text-sm font-semibold text-[#91969C] mb-4">Status da Sessao</h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${status.class}`}>
                {status.label}
              </span>
              
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
            </motion.div>

            {!session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#91969C]">
                  <span>Duracao:</span>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-200 rounded text-sm"
                  >
                    <option value={1}>1 min</option>
                    <option value={5}>5 min</option>
                    <option value={10}>10 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>1 hora</option>
                  </select>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenSession(duration)}
                  disabled={submitting}
                  className="w-full py-3 bg-[#0677F9] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Abrindo...' : 'Abrir Sessao de Votacao'}
                </motion.button>
              </div>
            ) : session.isActive ? (
              <div className="space-y-3">
                <Link 
                  to={`/votacao/${session.id}`}
                  className="block w-full py-3 bg-[#0677F9] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-center"
                >
                  Ir para Votacao
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseSessionClick}
                  disabled={submitting}
                  className="w-full py-3 border border-[#DEE0E3] rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Encerrando...' : 'Encerrar Sessao'}
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to={`/pautas/${session.agendaId}`}
                  className="w-full py-3 block bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Ver Resultado
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmCloseOpen}
        title="Encerrar Sessao"
        message="Tem certeza que deseja encerrar esta sessao de votacao? Nao sera possivel receber novos votosapos o encerramento."
        confirmLabel="Encerrar Sessao"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </div>
  );
}