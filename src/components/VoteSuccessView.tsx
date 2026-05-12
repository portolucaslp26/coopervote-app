import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export function VoteSuccessView() {
  return (
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
  );
}