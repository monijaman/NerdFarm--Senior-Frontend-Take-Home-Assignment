 'use client';

import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Task } from '@/types/task';
import { formatCurrency } from '@/lib/format';
import { UrgencyBadge } from '@/components/molecules/UrgencyBadge';
import { Button } from '@/components/atoms/Button';
import { getUrgency } from '@/lib/urgency';
// use native button here to avoid atom hover/bg overrides

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  removing?: boolean;
}

export function TaskCard({ task, isSelected, onClick, removing = false }: TaskCardProps) {
  const urgency = getUrgency(task.slaDeadline);

  // Subtle left-to-right gradient to indicate urgency (dark -> transparent)
  const urgencyGradient = {
    high:   'linear-gradient(90deg, rgba(220,38,38,0.18) 0%, rgba(255,255,255,0) 28%)',
    medium: 'linear-gradient(90deg, rgba(217,119,6,0.14) 0%, rgba(255,255,255,0) 28%)',
    low:    'linear-gradient(90deg, rgba(5,150,105,0.12) 0%, rgba(255,255,255,0) 28%)',
  }[urgency];

  return (
    <Button
      type="button"
      onClick={onClick}
      aria-selected={isSelected}
      aria-label={`Task: ${task.stepName}, case ${task.caseNumber}`}
      className={clsx(
        'w-full text-left pl-4 pr-6 py-3 rounded-lg border border-white/10 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30',
        // use transparent base so cards stay dark in the app background
        isSelected ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10',
        'hover:shadow-lg',
        removing && 'opacity-0 scale-95 max-h-0 p-0 m-0 pointer-events-none',
      )}
      style={{ backgroundImage: urgencyGradient } as CSSProperties}
    >
      {/* Simple two-column layout: left = stacked title + case/borrower, right = status on top + urgency/revenue below */}
      <div className="flex items-start justify-between gap-3 mb-1">
        {/* Left: Title then Case/Borrower */}
        <div className="flex-1  ">
          <div>
            <span
              title={task.stepName}
              className={clsx(
                'text-[16px] font-bold leading-snug block pr-3 min-w-0 w-full',
                isSelected ? 'text-white' : 'text-white/90',
              )}
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as CSSProperties}
            >
              {task.stepName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] mt-1 min-w-0">
            <span className="font-mono text-white/30 tracking-tight shrink-0">{task.caseNumber}</span>
            <span className="text-white/20 shrink-0">·</span>
            <span title={task.borrower} className="text-white/50 flex-1 min-w-0 truncate">{task.borrower}</span>
          </div>

          {/* New row: Urgency (Due) + date */}
          <div className="mt-1">
            <UrgencyBadge slaDeadline={task.slaDeadline} />
          </div>
        </div>

        {/* Right: Status (top) and Urgency + Revenue (below) */}
        <div className="flex flex-col items-end gap-2 shrink-0 w-24">
          <div>
            <span className={clsx(
              'px-2 py-1 rounded-full text-[10px] font-semibold',
              task.status === 'in-progress'
                ? 'bg-sky-500/25 text-sky-300'
                : 'bg-white/10 text-white/35',
            )}>
              {task.status === 'in-progress' ? 'Active' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-red-400 shrink-0">
              {formatCurrency(task.revenueAtRisk)}
            </span>
          </div>
        </div>
      </div>
    </Button>
  );
}
