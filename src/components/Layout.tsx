import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './Toast';
import { useAppStore } from '../stores/appStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, removeToast } = useAppStore();

  return (
<div className="min-h-screen bg-white flex flex-col font-sans">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>

      <footer className="py-4 text-center text-xs text-[#91969C] border-t border-gray-100">
        © 2026 Lucas Porto. Todos os direitos reservados.
      </footer>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}