'use client';

import { TaskQueue } from "@/features/taskQueue";
import { TaskDetail } from "@/features/taskDetail";
import { useTaskStore } from '@/store/taskStore';
import clsx from 'clsx';

export default function Home() {
  

  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);

  return (
    <main className="flex flex-1 h-full min-h-0 overflow-hidden flex-col md:flex-row">
      {/* Left panel — dark navy sidebar; full-width on mobile, fixed-width on md+ */}
      <aside className={clsx(
        'w-full md:w-[380px] h-full flex-shrink-0 flex flex-col min-h-0 bg-primary overflow-hidden',
        // hide queue on small screens when a task is selected (single-pane mobile view)
        selectedTaskId ? 'hidden md:flex' : 'flex'
      )}>
        <TaskQueue />
      </aside>

      {/* Right panel — Task Detail; stacks below on mobile. On small screens, take full height when a task is selected */}
      <section className={clsx(
        'flex-1 flex flex-col bg-background overflow-hidden relative',
        selectedTaskId ? 'h-full' : 'h-auto'
      )}>
        <TaskDetail />
      </section>
    </main>
  );
}
