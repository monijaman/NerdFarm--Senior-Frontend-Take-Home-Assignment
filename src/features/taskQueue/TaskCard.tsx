'use client';

import { clsx } from 'clsx';
import type { Task } from '@/types/task';
import { formatCurrency } from '@/lib/format';
import { UrgencyBadge } from '@/components/molecules/UrgencyBadge';
import { getUrgency } from '@/lib/urgency';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const urgency = getUrgency(task.slaDeadline);

  // Inset left shadow creates the urgency stripe (avoids border-shorthand conflicts)
  const urgencyShadow = {
    high:   'shadow-[inset_3px_0_0_#DC2626]',
    medium: 'shadow-[inset_3px_0_0_#D97706]',
    low:    'shadow-[inset_3px_0_0_#059669]',
  }[urgency];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={isSelected}
      aria-label={`Task: ${task.stepName}, case ${task.caseNumber}`}
      className={clsx(
        'w-full text-left px-3.5 py-3 rounded-lg border border-white/10 transition-all cursor-pointer',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30',
        urgencyShadow,
        isSelected
          ? 'bg-white/15 border-white/20'
          : 'bg-white/5 hover:bg-white/10 hover:border-white/20',
      )}
    >
      {/* Step name + status pill */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={clsx(
          'text-[13px] font-semibold leading-snug flex-1',
          isSelected ? 'text-white' : 'text-white/85',
        )}>
          {task.stepName}
        </span>
        <span className={clsx(
          'shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold mt-0.5',
          task.status === 'in-progress'
            ? 'bg-sky-500/25 text-sky-300'
            : 'bg-white/10 text-white/35',
        )}>
          {task.status === 'in-progress' ? 'Active' : 'Pending'}
        </span>
      </div>

      {/* Case number + borrower */}
      <div className="flex items-center gap-1.5 text-[11px] mb-2.5">
        <span className="font-mono text-white/30 tracking-tight">{task.caseNumber}</span>
        <span className="text-white/20">·</span>
        <span className="text-white/50 truncate">{task.borrower}</span>
      </div>

      {/* SLA urgency + revenue */}
      <div className="flex items-center justify-between gap-2">
        <UrgencyBadge slaDeadline={task.slaDeadline} />
        <span className="text-[11px] font-bold text-red-400 shrink-0">
          {formatCurrency(task.revenueAtRisk)}
        </span>
      </div>
    </button>
  );
}
