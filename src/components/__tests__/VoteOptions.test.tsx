import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoteOptions } from '../VoteOptions';

describe('VoteOptions', () => {
  it('should render SIM and NAO buttons', () => {
    render(<VoteOptions onVote={vi.fn()} />);
    expect(screen.getByText('SIM')).toBeInTheDocument();
    expect(screen.getByText('NAO')).toBeInTheDocument();
  });

  it('should render Escolha sua opcao label', () => {
    render(<VoteOptions onVote={vi.fn()} />);
    expect(screen.getByText('Escolha sua opcao')).toBeInTheDocument();
  });

  it('should call onVote with true when SIM is clicked', () => {
    const onVote = vi.fn();
    render(<VoteOptions onVote={onVote} />);
    fireEvent.click(screen.getByText('SIM'));
    expect(onVote).toHaveBeenCalledWith(true);
  });

  it('should call onVote with false when NAO is clicked', () => {
    const onVote = vi.fn();
    render(<VoteOptions onVote={onVote} />);
    fireEvent.click(screen.getByText('NAO'));
    expect(onVote).toHaveBeenCalledWith(false);
  });

  it('should disable buttons when disabled prop is true', () => {
    const onVote = vi.fn();
    render(<VoteOptions onVote={onVote} disabled />);
    const simButton = screen.getByText('SIM').closest('button');
    const naoButton = screen.getByText('NAO').closest('button');
    expect(simButton).toBeDisabled();
    expect(naoButton).toBeDisabled();
  });

  it('should not call onVote when disabled', () => {
    const onVote = vi.fn();
    render(<VoteOptions onVote={onVote} disabled />);
    fireEvent.click(screen.getByText('SIM'));
    expect(onVote).not.toHaveBeenCalled();
  });
});
