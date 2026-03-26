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
  // optimistic removal helpers
  removing: Record<string, boolean>;
  pendingRemovals: Record<string, Task>;
  removeTaskOptimistic: (id: string) => void;
  commitRemoval: (id: string) => void;
  restoreTask: (id: string) => void;
  finalizeRemoval: (id: string) => void;
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
  removing: {},
  pendingRemovals: {},
  setTasks: (tasks) => set({ tasks }),
  selectTask: (id) => set({ selectedTaskId: id }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  setSortBy: (sortBy) => set({ sortBy }),
  removeTaskOptimistic: (id: string) =>
    set((state) => {
      // mark as removing so UI can animate
      return { removing: { ...state.removing, [id]: true } } as unknown as TaskStore;
    }),
  // move task into pendingRemovals and remove from tasks after animation
  commitRemoval: (id: string) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return {} as unknown as TaskStore;
      const newTasks = state.tasks.filter((t) => t.id !== id);
      return {
        tasks: newTasks,
        pendingRemovals: { ...state.pendingRemovals, [id]: task },
        removing: Object.fromEntries(Object.entries(state.removing).filter(([k]) => k !== id)),
      } as unknown as TaskStore;
    }),
  restoreTask: (id: string) =>
    set((state) => {
      const pending = state.pendingRemovals[id];
      if (!pending) return {} as unknown as TaskStore;
      const { [id]: _removed, ...restPending } = state.pendingRemovals;
      return { tasks: [pending, ...state.tasks], pendingRemovals: restPending } as unknown as TaskStore;
    }),
  finalizeRemoval: (id: string) =>
    set((state) => {
      const { [id]: removed, ...restPending } = state.pendingRemovals;
      // ensure removing flag cleared
      const { [id]: _r, ...restRemoving } = state.removing;
      return { pendingRemovals: restPending, removing: restRemoving } as unknown as TaskStore;
    }),
}));
