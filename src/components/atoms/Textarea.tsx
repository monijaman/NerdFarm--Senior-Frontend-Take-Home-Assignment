import { clsx } from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      rows={3}
      className={clsx(
        'w-full rounded-md border px-3 py-2 text-sm text-text placeholder:text-muted bg-white resize-y',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:bg-surface disabled:cursor-not-allowed',
        error ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    />
  );
}
