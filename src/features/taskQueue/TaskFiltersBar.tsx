'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
// use native buttons here to guarantee exact utility classes for contrast
import type { TaskFilters, SortField } from '@/types/task';
import type { Task } from '@/types/task';
import { FilterMultiSelect } from '@/components/molecules/FilterMultiSelect';
import { getFilterOptions } from './taskUtils';

interface TaskFiltersBarProps {
  tasks: Task[];
  filters: TaskFilters;
  sortBy: SortField;
  onFilterChange: (partial: Partial<TaskFilters>) => void;
  onSortChange: (sort: SortField) => void;
}

export function TaskFiltersBar({
  tasks,
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
}: TaskFiltersBarProps) {
  const [expanded, setExpanded] = useState(false);
  const options = getFilterOptions(tasks);
  const activeCount =
    filters.client.length + filters.region.length +
    filters.category.length + filters.status.length;

  return (
    <div className="shrink-0">
      {/* Sort + filter toggle row */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10">
        {/* Sort buttons */}
        <div className="flex items-center gap-0.5 flex-1">
          {(['priority', 'slaDeadline', 'revenueAtRisk'] as SortField[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSortChange(s)}
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] leading-none border transition-colors',
                sortBy === s
                  ? 'bg-white/15 text-white/90 border-white/10'
                  : 'text-white/35 hover:text-white/65 border-transparent',
              )}
            >
              {s === 'priority' ? 'Priority' : s === 'slaDeadline' ? 'SLA' : 'Revenue'}
            </button>
          ))}
        </div>

        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={clsx(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] leading-none border transition-colors',
            expanded || activeCount > 0
              ? 'bg-white/15 text-white/90 border-white/10'
              : 'text-white/35 hover:text-white/65 border-transparent',
          )}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-sky-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded filter panels */}
      {expanded && (
        <div className="flex flex-col gap-3 px-3 py-3 border-b border-white/10 bg-black/20">
          <FilterMultiSelect label="Client"   options={options.client}   selected={filters.client}   onChange={(v) => onFilterChange({ client: v })} />
          <FilterMultiSelect label="Region"   options={options.region}   selected={filters.region}   onChange={(v) => onFilterChange({ region: v })} />
          <FilterMultiSelect label="Category" options={options.category} selected={filters.category} onChange={(v) => onFilterChange({ category: v })} />
          <FilterMultiSelect label="Status"   options={options.status}   selected={filters.status}   onChange={(v) => onFilterChange({ status: v })} />
        </div>
      )}
    </div>
  );
}
