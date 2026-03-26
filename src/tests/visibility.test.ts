import { describe, it, expect } from 'vitest';
import { evaluateVisibleWhen, getVisibleFields } from '@/lib/visibility';
import type { Field, FormData } from '@/types/schema';

// Helper to build a minimal field
function field(key: string, extras?: Partial<Field>): Field {
  return { key, label: key, type: 'text', ...extras } as Field;
}

describe('evaluateVisibleWhen', () => {
  it('returns true for fields without visibleWhen', () => {
    expect(evaluateVisibleWhen(field('foo'), {})).toBe(true);
  });

  it('hides when controlling field is null', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: 'yes' } });
    expect(evaluateVisibleWhen(f, { a: null })).toBe(false);
  });

  it('hides when controlling field is empty string', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: 'yes' } });
    expect(evaluateVisibleWhen(f, { a: '' })).toBe(false);
  });

  it('hides when controlling field is undefined', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: 'yes' } });
    expect(evaluateVisibleWhen(f, {})).toBe(false);
  });

  it('shows when equals condition is satisfied with string', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: 'Defects Found' } });
    expect(evaluateVisibleWhen(f, { a: 'Defects Found' })).toBe(true);
  });

  it('hides when equals condition is not satisfied with string', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: 'Defects Found' } });
    expect(evaluateVisibleWhen(f, { a: 'Clear' })).toBe(false);
  });

  it('shows when equals condition satisfied with boolean true', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: true } });
    expect(evaluateVisibleWhen(f, { a: true })).toBe(true);
  });

  it('hides when equals boolean condition not satisfied', () => {
    const f = field('b', { visibleWhen: { field: 'a', equals: true } });
    expect(evaluateVisibleWhen(f, { a: false })).toBe(false);
  });

  it('shows when notEquals condition is satisfied', () => {
    const f = field('b', { visibleWhen: { field: 'a', notEquals: 'Current' } });
    expect(evaluateVisibleWhen(f, { a: 'Delinquent' })).toBe(true);
  });

  it('hides when notEquals condition is not satisfied', () => {
    const f = field('b', { visibleWhen: { field: 'a', notEquals: 'Current' } });
    expect(evaluateVisibleWhen(f, { a: 'Current' })).toBe(false);
  });
});

describe('getVisibleFields', () => {
  const fields: Field[] = [
    field('a'),
    field('b', { visibleWhen: { field: 'a', equals: 'show' } }),
    field('c'),
    field('d'),
  ];

  it('returns all non-role-hidden, non-conditional fields when condition not set', () => {
    const formData: FormData = { a: 'other', b: null, c: '', d: '' };
    const visible = getVisibleFields(fields, formData, []);
    // b is hidden because a !== 'show'
    expect(visible.map((f) => f.key)).toEqual(['a', 'c', 'd']);
  });

  it('excludes role-hidden fields regardless of condition', () => {
    const formData: FormData = { a: 'show', b: 'x', c: '', d: '' };
    const visible = getVisibleFields(fields, formData, ['c']);
    expect(visible.map((f) => f.key)).toEqual(['a', 'b', 'd']);
  });

  it('shows conditional field when condition is met and not role-hidden', () => {
    const formData: FormData = { a: 'show', b: 'x', c: '', d: '' };
    const visible = getVisibleFields(fields, formData, []);
    expect(visible.map((f) => f.key)).toContain('b');
  });
});
