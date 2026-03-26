import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-md border px-3 py-2 text-sm text-text placeholder:text-muted bg-white',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:bg-surface disabled:cursor-not-allowed',
        error ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    />
  );
}
