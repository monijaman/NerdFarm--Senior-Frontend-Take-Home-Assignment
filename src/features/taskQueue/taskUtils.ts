import type { Task, TaskFilters, SortField } from '@/types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.client.length && !filters.client.includes(t.client)) return false;
    if (filters.region.length && !filters.region.includes(t.region)) return false;
    if (filters.category.length && !filters.category.includes(t.category)) return false;
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    return true;
  });
}

export function sortTasks(tasks: Task[], sortBy: SortField): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') return b.priority - a.priority;
    if (sortBy === 'slaDeadline')
      return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
    if (sortBy === 'revenueAtRisk') return b.revenueAtRisk - a.revenueAtRisk;
    return 0;
  });
}

/** Extract unique values for filter dropdowns */
export function getFilterOptions(tasks: Task[]) {
  return {
    client: [...new Set(tasks.map((t) => t.client))].sort(),
    region: [...new Set(tasks.map((t) => t.region))].sort(),
    category: [...new Set(tasks.map((t) => t.category))].sort(),
    status: [...new Set(tasks.map((t) => t.status))].sort(),
  };
}
