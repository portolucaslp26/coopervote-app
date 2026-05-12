import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CpfInputField } from '../CpfInputField';

vi.mock('../hooks/useCpfMask');

describe('CpfInputField', () => {
  it('should render input with placeholder', () => {
    render(<CpfInputField onCpfChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CpfInputField onCpfChange={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeDisabled();
  });

  it('should call onCpfChange when value changes', () => {
    const onCpfChange = vi.fn();
    render(<CpfInputField onCpfChange={onCpfChange} />);
    const input = screen.getByPlaceholderText('000.000.000-00');
    fireEvent.change(input, { target: { value: '123' } });
    expect(onCpfChange).toHaveBeenCalled();
  });
});
