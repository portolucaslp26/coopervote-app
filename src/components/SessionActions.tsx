import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { VotingSession } from '../types';

interface SessionActionsProps {
  session: VotingSession | null;
  onOpenSession: (duration: number) => Promise<void>;
  onCloseSession: () => void;
  submitting: boolean;
}

export function SessionActions({
  session,
  onOpenSession,
  onCloseSession,
  submitting,
}: SessionActionsProps) {
  const [duration, setDuration] = useState(1);

  if (!session) {
    return (
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
          onClick={() => onOpenSession(duration)}
          disabled={submitting}
          className="w-full py-3 bg-[#0677F9] text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Abrindo...' : 'Abrir Sessao de Votacao'}
        </motion.button>
      </div>
    );
  }

  if (session.isActive) {
    return (
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
          onClick={onCloseSession}
          disabled={submitting}
          className="w-full py-3 border border-[#DEE0E3] rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Encerrando...' : 'Encerrar Sessao'}
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/pautas/${session.agendaId}`}
        className="w-full py-3 block bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
      >
        Ver Resultado
      </Link>
    </motion.div>
  );
}