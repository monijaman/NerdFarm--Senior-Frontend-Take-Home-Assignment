import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import type { ActionVariant } from '@/types/schema';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<ActionVariant, string> = {
  primary:
    'bg-primary text-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed',
  secondary:
    'bg-surface text-text border border-border hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed',
  outline:
    'border border-primary text-primary hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed',
  destructive:
    'bg-danger text-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
