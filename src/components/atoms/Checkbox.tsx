import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const inputId = id ?? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label
      htmlFor={inputId}
      className={clsx('inline-flex items-center gap-2 cursor-pointer select-none', className)}
    >
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary/40"
        {...props}
      />
      <span className="text-sm text-text">{label}</span>
    </label>
  );
}
