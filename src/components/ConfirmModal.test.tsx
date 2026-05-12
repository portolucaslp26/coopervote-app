import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from '../components/ConfirmModal';

describe('ConfirmModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when open is false', () => {
    const { container } = render(
      <ConfirmModal
        open={false}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when open is true', () => {
    render(
      <ConfirmModal
        open={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('renders with default labels when not provided', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('renders with custom labels when provided', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        confirmLabel="Sim"
        cancelLabel="Não"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Não')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    fireEvent.click(screen.getByText('Confirmar'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when backdrop is clicked', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const backdrop = document.querySelector('.absolute');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('renders with primary variant styling by default', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmButton = screen.getByText('Confirmar');
    expect(confirmButton.className).toContain('bg-[#0677F9]');
  });

  it('renders with danger variant styling when confirmVariant is danger', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        confirmVariant="danger"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const confirmButton = screen.getByText('Confirmar');
    expect(confirmButton.className).toContain('bg-red-600');
  });

  it('renders danger icon when confirmVariant is danger', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        confirmVariant="danger"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const iconContainer = document.querySelector('.w-10.h-10');
    expect(iconContainer).toBeTruthy();
  });

  it('renders help icon when confirmVariant is primary', () => {
    render(
      <ConfirmModal
        open={true}
        title="Title"
        message="Message"
        confirmVariant="primary"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    const iconContainer = document.querySelector('.w-10.h-10');
    expect(iconContainer).toBeTruthy();
  });
});