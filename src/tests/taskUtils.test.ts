import { describe, it, expect } from 'vitest';
import { filterTasks, sortTasks } from '@/features/taskQueue/taskUtils';
import type { Task } from '@/types/task';

const base: Task = {
  id: '1',
  caseNumber: 'C-001',
  stepName: 'Review Title',
  category: 'FC-Judicial',
  region: 'US.IL.Cook',
  client: 'Chase',
  priority: 5,
  slaDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  assignedRole: 'processor',
  status: 'pending',
  borrower: 'Alice Smith',
  propertyAddress: '123 Main St',
  milestoneAtRisk: 'Title Review',
  revenueAtRisk: 5000,
  schemaRef: 'review-title-search',
};

const tasks: Task[] = [
  { ...base, id: '1', client: 'Chase', region: 'US.IL.Cook', category: 'FC-Judicial', status: 'pending', priority: 10, revenueAtRisk: 5000, slaDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
  { ...base, id: '2', client: 'Wells Fargo', region: 'US.FL.Miami', category: 'FC-NonJudicial', status: 'in-progress', priority: 7, revenueAtRisk: 12000, slaDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { ...base, id: '3', client: 'Nationstar', region: 'US.TX.Harris', category: 'FC-Judicial', status: 'pending', priority: 2, revenueAtRisk: 3000, slaDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() },
];

describe('filterTasks', () => {
  it('returns all tasks when no filters active', () => {
    const result = filterTasks(tasks, { client: [], region: [], category: [], status: [] });
    expect(result).toHaveLength(3);
  });

  it('filters by single client', () => {
    const result = filterTasks(tasks, { client: ['Chase'], region: [], category: [], status: [] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by multiple clients (OR within same dimension)', () => {
    const result = filterTasks(tasks, { client: ['Chase', 'Nationstar'], region: [], category: [], status: [] });
    expect(result).toHaveLength(2);
  });

  it('composes multiple filter dimensions with AND logic', () => {
    // Chase AND FC-Judicial → only task 1
    const result = filterTasks(tasks, { client: ['Chase'], region: [], category: ['FC-Judicial'], status: [] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty when no tasks match', () => {
    const result = filterTasks(tasks, { client: ['Chase'], region: [], category: ['FC-NonJudicial'], status: [] });
    expect(result).toHaveLength(0);
  });

  it('filters by status', () => {
    const result = filterTasks(tasks, { client: [], region: [], category: [], status: ['in-progress'] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});

describe('sortTasks', () => {
  it('sorts by priority descending (default)', () => {
    const result = sortTasks(tasks, 'priority');
    expect(result.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('sorts by slaDeadline ascending (soonest first)', () => {
    const result = sortTasks(tasks, 'slaDeadline');
    expect(result[0].id).toBe('1'); // 1 day away
    expect(result[2].id).toBe('3'); // 15 days away
  });

  it('sorts by revenueAtRisk descending', () => {
    const result = sortTasks(tasks, 'revenueAtRisk');
    expect(result[0].id).toBe('2'); // 12000
    expect(result[2].id).toBe('3'); // 3000
  });

  it('does not mutate original array', () => {
    const original = [...tasks];
    sortTasks(tasks, 'revenueAtRisk');
    expect(tasks[0].id).toBe(original[0].id);
  });
});
