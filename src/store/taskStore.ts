'use client';

import { create } from 'zustand';
import type { Task, TaskFilters, SortField } from '@/types/task';

interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  filters: TaskFilters;
  sortBy: SortField;
  setTasks: (tasks: Task[]) => void;
  selectTask: (id: string | null) => void;
  setFilters: (partial: Partial<TaskFilters>) => void;
  setSortBy: (sort: SortField) => void;
}

const defaultFilters: TaskFilters = {
  client: [],
  region: [],
  category: [],
  status: [],
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedTaskId: null,
  filters: defaultFilters,
  sortBy: 'priority',
  setTasks: (tasks) => set({ tasks }),
  selectTask: (id) => set({ selectedTaskId: id }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  setSortBy: (sortBy) => set({ sortBy }),
}));
