import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgendaInfo } from '../AgendaInfo';
import type { Agenda } from '../../types';

describe('AgendaInfo', () => {
  const mockAgenda: Agenda = {
    id: 1,
    title: 'Pauta Teste',
    description: 'Descricao',
    createdAt: '2026-04-27',
  };

  it('should render agenda title', () => {
    render(<AgendaInfo agenda={mockAgenda} />);
    expect(screen.getByText('Pauta Teste')).toBeInTheDocument();
  });

  it('should render agenda ID', () => {
    render(<AgendaInfo agenda={mockAgenda} />);
    expect(screen.getByText('ID: #1')).toBeInTheDocument();
  });
});
