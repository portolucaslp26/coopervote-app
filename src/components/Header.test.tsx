import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header', () => {
  it('deve renderizar o titulo da marca', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByText('CooperVote')).toBeInTheDocument();
  });

  it('deve renderizar o link Nova Pauta', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Nova Pauta')).toBeInTheDocument();
  });
});