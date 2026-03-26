'use client';

import { useReducer, useEffect, useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { useTaskStore } from '@/store/taskStore';
import { useUserStore } from '@/store/userStore';
import type { TaskSchema, FormData } from '@/types/schema';
import { buildDefaultFormData, mergeFormData, buildSubmissionPayload } from './formHelpers';
import { formatCurrency } from '@/lib/format';
import { SchemaRenderer } from '@/features/schemaRenderer';

type Status = 'idle' | 'loading' | 'success' | 'error';

type State = {
  schema: TaskSchema | null;
  formData: FormData;
  status: Status;
};

type Action =
  | { type: 'RESET' }
  | { type: 'LOADING' }
  | { type: 'LOADED'; schema: TaskSchema; formData: FormData }
  | { type: 'ERROR' }
  | { type: 'FIELD_CHANGE'; key: string; value: FormData[string] };

const initialState: State = { schema: null, formData: {}, status: 'idle' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'LOADING':
      return { ...state, status: 'loading' };
    case 'LOADED':
      return { schema: action.schema, formData: action.formData, status: 'success' };
    case 'ERROR':
      return { ...state, status: 'error' };
    case 'FIELD_CHANGE':
      return { ...state, formData: { ...state.formData, [action.key]: action.value } };
  }
}

export function TaskDetail() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const { user, activeRole } = useUserStore();

  const task = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const [{ schema, formData, status }, dispatch] = useReducer(reducer, initialState);
  const [toast, setToast] = useState<string | null>(null);

  const taskId = task?.id ?? null;
  const schemaRef = task?.schemaRef ?? null;

  useEffect(() => {
    if (!taskId || !schemaRef) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'LOADING' });

    let cancelled = false;
    Promise.all([
      fetch(`/api/task-schemas/${schemaRef}`).then((r) => r.json()),
      fetch(`/api/task-data/${taskId}`).then((r) => r.json()),
    ])
      .then(([fetchedSchema, taskData]: [TaskSchema, Record<string, unknown> | null]) => {
        if (cancelled) return;
        const defaults = buildDefaultFormData(fetchedSchema);
        const merged = mergeFormData(defaults, taskData);
        dispatch({ type: 'LOADED', schema: fetchedSchema, formData: merged });
      })
      .catch(() => { if (!cancelled) dispatch({ type: 'ERROR' }); });

    return () => { cancelled = true; };
  }, [taskId, schemaRef]);

  const handleFieldChange = useCallback(
    (key: string, value: FormData[string]) => {
      dispatch({ type: 'FIELD_CHANGE', key, value });
    },
    [],
  );

  const handleAction = useCallback(
    (actionKey: string) => {
      if (!task || !user || !schema) return;
      const roleRules = schema.roleVisibility[activeRole] ?? {
        hiddenFields: [],
        hiddenSections: [],
        disabledActions: [],
      };
      const payload = buildSubmissionPayload(task.id, actionKey, schema, formData, roleRules, user.id);
      console.log('[Command Center] Action submitted:', payload);
      setToast(`Action "${actionKey}" submitted successfully.`);
      setTimeout(() => setToast(null), 3000);
    },
    [task, user, schema, activeRole, formData],
  );

  if (!task) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-8">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-border" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-muted">No task selected</p>
          <p className="text-xs text-muted/60 mt-1">Choose a task from the queue to view its details</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center gap-2.5">
        <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="text-sm text-muted">Loading task…</span>
      </div>
    );
  }

  if (status === 'error' || !schema) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-danger">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm">Failed to load task details.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Task meta header */}
      <div className="px-6 pt-5 pb-4 border-b border-border bg-surface shadow-sm shrink-0">
        {/* Top meta row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-muted/80 uppercase tracking-wider">{task.caseNumber}</span>
          <span className="text-border text-xs">·</span>
          <span className="text-[10px] text-muted/70">{task.region}</span>
          <span className="text-border text-xs">·</span>
          <span className="text-[10px] text-muted font-medium">{task.client}</span>
          <span className={clsx(
            'ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
            task.status === 'in-progress'
              ? 'bg-sky-100 text-sky-600'
              : 'bg-slate-100 text-slate-500',
          )}>
            {task.status === 'in-progress' ? 'Active' : 'Pending'}
          </span>
        </div>
        {/* Step name + risk */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-text leading-snug">{task.stepName}</h2>
            <p className="text-[11px] text-muted mt-1 truncate">{task.borrower} — {task.propertyAddress}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] text-muted uppercase tracking-wide mb-0.5">Milestone at risk</p>
            <p className="text-[12px] font-semibold text-danger leading-tight max-w-[180px]">{task.milestoneAtRisk}</p>
            <p className="text-[14px] font-bold text-danger mt-0.5">{formatCurrency(task.revenueAtRisk)}</p>
          </div>
        </div>
      </div>

      {/* Schema-driven form */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <SchemaRenderer
          schema={schema}
          formData={formData}
          activeRole={activeRole}
          onFieldChange={handleFieldChange}
          onAction={handleAction}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 12l2 2 4-4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="1.5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
