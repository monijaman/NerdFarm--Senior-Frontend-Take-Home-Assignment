'use client';

import { clsx } from 'clsx';
import { Button } from '@/components/atoms/Button';

interface FilterMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export function FilterMultiSelect({
  label,
  options,
  selected,
  onChange,
}: FilterMultiSelectProps) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <Button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            variant={selected.includes(opt) ? 'primary' : 'secondary'}
            className={clsx(
              'px-2 py-0.5 text-[11px]',
              selected.includes(opt)
                ? 'bg-sky-600/70 text-white border-sky-500/50'
                : 'bg-transparent text-white/45 border-white/15 hover:text-white/80 hover:border-white/35',
            )}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}
