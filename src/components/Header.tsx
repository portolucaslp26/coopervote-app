import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#F4F5F6] bg-white shadow-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          className="md:hidden p-2 text-[#91969C]"
          onClick={onMenuClick}
        >
          <Icon icon="lucide:menu" className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0677F9] rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className="text-[#0677F9] text-xl font-bold tracking-tight">CooperVote</span>
        </div>
        <div className="hidden md:block h-6 w-[1px] bg-[#F4F5F6]" />
        <span className="hidden md:block text-[#91969C] text-sm font-semibold tracking-[0.7px] uppercase">
          Assembleia Digital
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/pautas/nova"
          className="hidden sm:flex items-center gap-2 px-3 py-2 border border-[#DEE0E3] rounded-lg text-sm font-medium text-[#171A1C] hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Pauta
        </Link>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100 bg-gray-200">
          <div className="w-full h-full flex items-center justify-center bg-[#F4F5F6]">
            <svg className="w-5 h-5 text-[#91969C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}