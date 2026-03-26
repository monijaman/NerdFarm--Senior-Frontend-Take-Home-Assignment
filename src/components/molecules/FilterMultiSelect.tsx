'use client';

import { clsx } from 'clsx';

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
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={clsx(
              'px-2 py-0.5 rounded text-[11px] border transition-all',
              selected.includes(opt)
                ? 'bg-sky-600/70 text-white border-sky-500/50'
                : 'bg-transparent text-white/45 border-white/15 hover:text-white/80 hover:border-white/35',
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
