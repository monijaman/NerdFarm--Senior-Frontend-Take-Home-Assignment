'use client';

import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types/user';
import type { Task } from '@/types/task';
import { ToastProvider } from '@/context/ToastContext';

/** Bootstraps user + tasks from mock API on mount */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);
  const setTasks = useTaskStore((s) => s.setTasks);

  useEffect(() => {
    Promise.all([
      fetch('/api/user').then((r) => r.json() as Promise<User>),
      fetch('/api/tasks').then((r) => r.json() as Promise<Task[]>),
    ]).then(([user, tasks]) => {
      setUser(user);
      setTasks(tasks);
    });
  }, []);

  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
