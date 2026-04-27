import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#F9FAFA] border-r border-[#F4F5F6] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="flex flex-col h-full p-4">
          <div className="space-y-2 flex-1 pt-4">
            <NavLink 
              to="/"
              className={({ isActive }) => `
                flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-[#0677F9]/10 text-[#0677F9]' : 'text-[#91969C] hover:bg-gray-100'}
              `}
              onClick={onClose}
            >
              <Icon icon="lucide:layout-dashboard" className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/pautas"
              className={({ isActive }) => `
                flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-[#0677F9]/10 text-[#0677F9]' : 'text-[#91969C] hover:bg-gray-100'}
              `}
              onClick={onClose}
            >
              <Icon icon="lucide:list-todo" className="w-5 h-5" />
              Pautas
            </NavLink>
          </div>
          <div className="pt-4 border-t border-[#F4F5F6]">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-[#D92626] font-medium text-sm hover:bg-red-50 rounded-lg transition-colors">
              <Icon icon="lucide:log-out" className="w-5 h-5" />
              Sair
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}