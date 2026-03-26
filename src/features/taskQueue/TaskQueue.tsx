'use client';

import { useTaskStore } from '@/store/taskStore';
import { filterTasks, sortTasks } from './taskUtils';
import { TaskCard } from './TaskCard';
import { TaskFiltersBar } from './TaskFiltersBar';

export function TaskQueue() {
  const { tasks, selectedTaskId, filters, sortBy, selectTask, setFilters, setSortBy } =
    useTaskStore();

  const visible = sortTasks(filterTasks(tasks, filters), sortBy);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Queue header */}
      <div className="px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-white/10">
        <h2 className="text-[13px] font-semibold text-white/90 tracking-tight">Task Queue</h2>
        <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-0.5">
          <span className="text-[11px] font-semibold text-white/70">{visible.length}</span>
          <span className="text-white/25 text-[11px]">/</span>
          <span className="text-[11px] text-white/40">{tasks.length}</span>
        </div>
      </div>

      <TaskFiltersBar
        tasks={tasks}
        filters={filters}
        sortBy={sortBy}
        onFilterChange={setFilters}
        onSortChange={setSortBy}
      />

      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1" role="list">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/20" aria-hidden="true">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[12px] text-white/25">No tasks match these filters</p>
          </div>
        ) : (
          visible.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard
                task={task}
                isSelected={task.id === selectedTaskId}
                onClick={() => selectTask(task.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
