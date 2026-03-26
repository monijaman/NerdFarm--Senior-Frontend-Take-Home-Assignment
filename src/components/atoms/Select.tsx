import { clsx } from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
  error?: boolean;
}

export function Select({ options, placeholder, className, error, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        'w-full rounded-md border px-3 py-2 text-sm text-text bg-white',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:bg-surface disabled:cursor-not-allowed',
        error ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
