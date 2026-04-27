import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { agendaService } from '../services/agendaService';
import { useAppStore } from '../stores/appStore';

export function PautaCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      addToast({ type: 'error', message: 'O titulo e obrigatorio' });
      return;
    }

setSubmitting(true);
    try {
      await agendaService.create({ title, description });
      addToast({ type: 'success', message: 'Pauta criada com sucesso!' });
      navigate('/');
    } catch (error) {
      addToast({ type: 'error', message: 'Nao foi possivel criar a pauta' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/pautas')}
          className="flex items-center gap-2 text-[#91969C] text-sm font-medium mb-6 hover:text-[#171A1C]"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Voltar para Listagem
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Criar Nova Pauta</h1>
          <p className="text-[#91969C]">Preencha os dados para criar uma nova pauta de votacao.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-[#F4F5F6] space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171A1C]">
              Titulo da Pauta <span className="text-[#D92626]">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Ex: Aprovacao de Investimento 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#DEE0E3] rounded-xl text-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#171A1C]">Descricao Detalhada</label>
            <textarea 
              rows={5}
              placeholder="Descreva os pontos principais que serao votados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#DEE0E3] rounded-xl text-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate('/pautas')}
              className="px-6 py-2.5 border border-[#DEE0E3] rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#0677F9] text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Criando...' : 'Criar Pauta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}