import { useState, useEffect } from 'react';

export function useCpfMask(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const formatCpf = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setValue(formatted);
  };

  const getDigits = (): string => {
    return value.replace(/\D/g, '');
  };

  const isValid = (): boolean => {
    const digits = getDigits();
    return digits.length === 11;
  };

  return {
    value,
    handleChange,
    getDigits,
    isValid,
    setValue,
  };
}