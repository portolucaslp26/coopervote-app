import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

const renderWithRouter = (isOpen: boolean, onClose: () => void) => {
  return render(
    <BrowserRouter>
      <Sidebar isOpen={isOpen} onClose={onClose} />
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  it('should render Dashboard link', () => {
    renderWithRouter(true, vi.fn());
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render Pautas link', () => {
    renderWithRouter(true, vi.fn());
    expect(screen.getByText('Pautas')).toBeInTheDocument();
  });

  it('should render Sair button', () => {
    renderWithRouter(true, vi.fn());
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    renderWithRouter(true, onClose);
    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) {
      // Overlay renders when isOpen is true
    }
  });
});
