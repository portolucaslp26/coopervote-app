import type { VotingSession } from '../types';

interface StatusBadgeProps {
  session?: VotingSession;
  className?: string;
}

export function StatusBadge({ session, className = '' }: StatusBadgeProps) {
  const status = session
    ? session.isActive
      ? { label: 'Ativo', class: 'bg-green-50 text-green-700 border-green-200' }
      : { label: 'Encerrado', class: 'bg-gray-100 text-gray-600 border-gray-200' }
    : { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' };

  return (
    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${status.class} ${className}`}>
      {status.label}
    </span>
  );
}