import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast, ToastContainer } from '../components/Toast';

describe('Toast', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders success toast with correct message', () => {
    render(<Toast id="1" type="success" message="Operação realizada" onClose={mockOnClose} />);
    expect(screen.getByText('Operação realizada')).toBeInTheDocument();
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('renders error toast with correct message', () => {
    render(<Toast id="2" type="error" message="Algo deu errado" onClose={mockOnClose} />);
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Erro')).toBeInTheDocument();
  });

  it('renders warning toast with correct message', () => {
    render(<Toast id="3" type="warning" message="Atenção" onClose={mockOnClose} />);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Aviso')).toBeInTheDocument();
  });

  it('renders info toast with correct message', () => {
    render(<Toast id="4" type="info" message="Informação" onClose={mockOnClose} />);
    expect(screen.getByText('Informação')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('calls onClose after 4 seconds', () => {
    render(<Toast id="1" type="success" message="Test" onClose={mockOnClose} />);
    expect(mockOnClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(4000);
    expect(mockOnClose).toHaveBeenCalledWith('1');
  });

  it('clears timer on unmount', () => {
    const { unmount } = render(<Toast id="1" type="success" message="Test" onClose={mockOnClose} />);
    unmount();
    vi.advanceTimersByTime(4000);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast id="1" type="success" message="Test" onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Fechar'));
    expect(mockOnClose).toHaveBeenCalledWith('1');
  });

  it('renders all toast types without crashing', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = ['success', 'error', 'warning', 'info'];
    types.forEach((type) => {
      const { container } = render(<Toast id={type} type={type} message={`Test ${type}`} onClose={mockOnClose} />);
      expect(container.querySelector('div')).toBeTruthy();
    });
  });
});

describe('ToastContainer', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders multiple toasts', () => {
    const toasts = [
      { id: '1', type: 'success' as const, message: 'Mensagem 1' },
      { id: '2', type: 'error' as const, message: 'Mensagem 2' },
      { id: '3', type: 'info' as const, message: 'Mensagem 3' },
    ];
    render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);
    expect(screen.getByText('Mensagem 1')).toBeInTheDocument();
    expect(screen.getByText('Mensagem 2')).toBeInTheDocument();
    expect(screen.getByText('Mensagem 3')).toBeInTheDocument();
  });

  it('renders empty container when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onClose={mockOnClose} />);
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.className).toContain('space-y-2');
  });

  it('calls onClose with correct id when close button is clicked', () => {
    const toasts = [
      { id: '1', type: 'success' as const, message: 'Mensagem 1' },
      { id: '2', type: 'error' as const, message: 'Mensagem 2' },
    ];
    render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);
    const closeButtons = screen.getAllByText('Fechar');
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalledWith('1');
  });
});