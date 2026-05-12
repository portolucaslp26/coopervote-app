import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface VoteOptionsProps {
  onVote: (value: boolean) => void;
  disabled?: boolean;
}

export function VoteOptions({ onVote, disabled }: VoteOptionsProps) {
  return (
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
          onClick={() => onVote(true)}
          disabled={disabled}
          className="h-24 flex items-center justify-center gap-3 border-2 border-green-500 bg-green-50 text-green-700 rounded-xl font-bold text-xl hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          <Icon icon="lucide:check-circle" className="w-8 h-8" />
          SIM
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVote(false)}
          disabled={disabled}
          className="h-24 flex items-center justify-center gap-3 border-2 border-red-500 bg-red-50 text-red-700 rounded-xl font-bold text-xl hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <Icon icon="lucide:x-circle" className="w-8 h-8" />
          NAO
        </motion.button>
      </div>
    </div>
  );
}