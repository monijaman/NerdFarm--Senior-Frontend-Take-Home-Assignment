import { TaskQueue } from "@/features/taskQueue";
import { TaskDetail } from "@/features/taskDetail";

export default function Home() {
  return (
    <main className="flex flex-1 overflow-hidden">
      {/* Left panel — dark navy sidebar */}
      <aside className="w-[380px] shrink-0 flex flex-col bg-[#0C1929] overflow-hidden">
        <TaskQueue />
      </aside>

      {/* Right panel — Task Detail */}
      <section className="flex flex-1 flex-col bg-background overflow-hidden relative">
        <TaskDetail />
      </section>
    </main>
  );
}
