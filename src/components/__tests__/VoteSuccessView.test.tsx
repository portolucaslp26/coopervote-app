import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VoteSuccessView } from '../VoteSuccessView';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('VoteSuccessView', () => {
  it('should render vote confirmed message', () => {
    renderWithRouter(<VoteSuccessView />);
    expect(screen.getByText('Voto Confirmado!')).toBeInTheDocument();
  });

  it('should render success message', () => {
    renderWithRouter(<VoteSuccessView />);
    expect(screen.getByText('Seu voto foi registrado com sucesso.')).toBeInTheDocument();
  });

  it('should render Voltar para Pautas link', () => {
    renderWithRouter(<VoteSuccessView />);
    expect(screen.getByText('Voltar para Pautas')).toBeInTheDocument();
  });
});
