import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCpfMask } from '../useCpfMask';

describe('useCpfMask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty value initially', () => {
    const { result } = renderHook(() => useCpfMask());
    expect(result.current.value).toBe('');
  });

  it('should return provided initial value', () => {
    const { result } = renderHook(() => useCpfMask('123'));
    expect(result.current.value).toBe('123');
  });

  it('should format CPF correctly - less than 3 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '12' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('12');
  });

  it('should format CPF correctly - 3 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '123' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123');
  });

  it('should format CPF correctly - 4-5 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '12345' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123.45');
  });

  it('should format CPF correctly - 6-8 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '1234567' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123.456.7');
  });

  it('should format CPF correctly - 9-11 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '12345678901' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123.456.789-01');
  });

  it('should limit to 11 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '123456789012' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123.456.789-01');
  });

  it('should return only digits from getDigits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '123.456.789-01' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.getDigits()).toBe('12345678901');
  });

  it('should return true from isValid when 11 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '123.456.789-01' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isValid()).toBe(true);
  });

  it('should return false from isValid when less than 11 digits', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.handleChange({ target: { value: '123.456.789' } } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.isValid()).toBe(false);
  });

  it('should set value directly', () => {
    const { result } = renderHook(() => useCpfMask());
    act(() => {
      result.current.setValue('999.999.999-99');
    });
    expect(result.current.value).toBe('999.999.999-99');
  });
});
