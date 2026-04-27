import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { agendaService } from '../services/agendaService';
import { sessionService } from '../services/sessionService';
import { voteService } from '../services/voteService';
import { useAppStore } from '../stores/appStore';
import { useCpfMask } from '../hooks/useCpfMask';
import { ConfirmModal } from '../components/ConfirmModal';
import type { Agenda, VotingSession } from '../types';

export function VotingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [session, setSession] = useState<VotingSession | null>(null);
  const { value: cpf, handleChange: handleCpfChange, getDigits, isValid } = useCpfMask();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<boolean | null>(null);
  const { addToast } = useAppStore();

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const sessionData = await sessionService.getById(Number(id));
      setSession(sessionData);
      
      const isExpired = new Date(sessionData.endTime) <= new Date();
      if (!sessionData.isActive || isExpired) {
        addToast({ type: 'warning', message: 'Sessao ja foi encerrada' });
        navigate('/pautas');
        return;
      }
      
      const agendaData = await agendaService.getById(sessionData.agendaId);
      setAgenda(agendaData);
    } catch (error) {
      addToast({ type: 'error', message: 'Erro ao carregar sessao' });
      navigate('/pautas');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (voteValue: boolean) => {
    if (!isValid()) {
      addToast({ type: 'error', message: 'CPF invalido. Digite 11 digitos.' });
      return;
    }
    setPendingVote(voteValue);
    setConfirmOpen(true);
  };

  const handleConfirmVote = async () => {
    if (pendingVote === null) return;
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      await voteService.cast(Number(id), { cpf: getDigits(), voteValue: pendingVote });
      setVoted(true);
      addToast({ type: 'success', message: 'Voto registrado com sucesso!' });
    } catch (error: any) {
      const data = error.response?.data;
      const status = error.response?.status;
      let message = 'Erro ao registrar voto';
      let type: 'error' | 'warning' = 'error';
      
      if (status === 409) {
        type = 'warning';
        message = data?.detail || data?.title || 'Voce ja votou nesta sessao';
      } else if (status === 422) {
        type = 'warning';
        message = data?.detail || data?.title || 'Voto nao permitido';
      } else if (data?.detail) {
        message = data.detail;
      } else if (data?.title) {
        message = data.title;
      }
      
      addToast({ type, message });
    } finally {
      setSubmitting(false);
      setPendingVote(null);
    }
  };

  const handleCancelVote = () => {
    setConfirmOpen(false);
    setPendingVote(null);
  };

  if (loading) {
    return (
        <div className="flex-1 flex items-center justify-center p-4" data-testid="loading">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0677F9]"></div>
        </div>
    );
  }

  if (voted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="max-w-md text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="lucide:check" className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#171A1C] mb-2">Voto Confirmado!</h1>
          <p className="text-[#91969C] mb-8">Seu voto foi registrado com sucesso.</p>
          <Link 
            to="/pautas"
            className="inline-block px-6 py-2.5 bg-[#0677F9] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Voltar para Pautas
          </Link>
        </motion.div>
      </div>
    );
  }

return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 lg:py-12">
      <div className="w-full max-w-[640px] space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-[0px_8px_16px_0px_#0000001f] overflow-hidden"
        >
          <div className="h-2 bg-[#0677F9] w-full" />
          
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="px-3 py-0.5 bg-green-50 border border-green-500 text-green-700 text-xs font-semibold rounded-full">
                Ativo
              </span>
              <span className="text-[#91969C] text-[10px] md:text-xs font-medium tracking-[0.6px] uppercase">
                ID: #{session?.id}
              </span>
            </div>

            <h1 className="text-2xl md:text-[30px] leading-tight font-bold tracking-[-0.75px] mb-8">
              {agenda?.title}
            </h1>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
              <div className="flex items-start gap-3">
                <Icon icon="lucide:info" className="w-5 h-5 mt-0.5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-semibold mb-1 text-gray-800">Resumo da Proposta</h3>
                  <p className="text-gray-800 text-sm leading-[23px]">
                      {agenda?.description || 'Nenhuma descricao disponivel.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user" className="w-4 h-4" />
                <span className="text-sm font-semibold">Identifique-se para votar</span>
              </div>
              <input 
                type="text" 
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="w-full h-14 px-5 border-2 border-[#DEE0E3] rounded-xl text-sm font-medium placeholder:text-[#91969C] focus:border-[#0677F9] outline-none transition-all"
              />
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[#91969C] text-[10px] md:text-xs font-bold tracking-[2.4px] uppercase">
                  Escolha sua opcao
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVoteClick(true)}
                  disabled={submitting}
                  className="h-24 flex items-center justify-center gap-3 border-2 border-green-500 bg-green-50 text-green-700 rounded-xl font-bold text-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <Icon icon="lucide:check-circle" className="w-8 h-8" />
                  SIM
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVoteClick(false)}
                  disabled={submitting}
                  className="h-24 flex items-center justify-center gap-3 border-2 border-red-500 bg-red-50 text-red-700 rounded-xl font-bold text-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Icon icon="lucide:x-circle" className="w-8 h-8" />
                  NAO
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3"
        >
          <Icon icon="lucide:shield-check" className="w-4 h-4 mt-0.5 text-blue-600" />
          <div>
            <h4 className="text-blue-700 text-xs font-bold tracking-[0.6px] uppercase mb-1">
              Aviso de Seguranca
            </h4>
            <p className="text-blue-600 text-xs leading-relaxed">
              Seu voto e secreto e irrevogavel apos a confirmacao. Certifique-se de que esta logado em um dispositivo confiavel.
            </p>
          </div>
        </motion.div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Confirmar Voto"
        message={`Tem certeza que deseja votar "${pendingVote ? 'SIM' : 'NAO'}" nesta pauta? Este voto nao podera ser alterado.`}
        confirmLabel="Confirmar Voto"
        cancelLabel="Cancelar"
        confirmVariant={pendingVote ? 'primary' : 'danger'}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
      />
    </div>
  );
}