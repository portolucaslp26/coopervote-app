import { useCpfMask } from '../hooks/useCpfMask';

interface CpfInputFieldProps {
  onCpfChange: (digits: string, isValid: boolean) => void;
  disabled?: boolean;
}

export function CpfInputField({ onCpfChange, disabled }: CpfInputFieldProps) {
  const { value, handleChange, getDigits, isValid } = useCpfMask();

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    onCpfChange(getDigits(), isValid());
  };

  return (
    <input
      type="text"
      placeholder="000.000.000-00"
      value={value}
      onChange={handleChangeEvent}
      maxLength={14}
      disabled={disabled}
      className="w-full h-14 px-5 border-2 border-[#DEE0E3] rounded-xl text-sm font-medium placeholder:text-[#91969C] focus:border-[#0677F9] outline-none transition-all disabled:opacity-50"
    />
  );
}