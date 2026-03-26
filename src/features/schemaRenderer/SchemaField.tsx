'use client';

import type { Field, FormData, TableRow } from '@/types/schema';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Checkbox } from '@/components/atoms/Checkbox';
import { formatCurrency } from '@/lib/format';

interface SchemaFieldProps {
  field: Field;
  value: FormData[string];
  onChange: (key: string, value: FormData[string]) => void;
}

export function SchemaField({ field, value, onChange }: SchemaFieldProps) {
  const { key, label, readonly } = field;

  if (field.type === 'table') {
    const rows = (value as TableRow[]) ?? [];
    return (
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              {field.columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left text-xs font-medium text-muted uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="bg-white hover:bg-surface/60">
                {field.columns.map((col) => {
                  const isEditable = field.editableColumns?.includes(col.key);
                  const cellVal = row[col.key];

                  if (!isEditable) {
                    const display =
                      col.type === 'currency' && typeof cellVal === 'number'
                        ? formatCurrency(cellVal)
                        : col.type === 'checkbox'
                          ? (cellVal ? '✓' : '—')
                          : (cellVal ?? '—');
                    return (
                      <td key={col.key} className="px-3 py-2 text-text whitespace-nowrap">
                        {String(display)}
                      </td>
                    );
                  }

                  function updateCell(newVal: string | boolean) {
                    const updated = rows.map((r, i) =>
                      i === rowIdx ? { ...r, [col.key]: newVal } : r,
                    );
                    onChange(key, updated);
                  }

                  if (col.type === 'checkbox') {
                    return (
                      <td key={col.key} className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={!!cellVal}
                          onChange={(e) => updateCell(e.target.checked)}
                          className="h-4 w-4 rounded accent-primary"
                        />
                      </td>
                    );
                  }

                  if (col.type === 'select' && col.options) {
                    return (
                      <td key={col.key} className="px-3 py-2">
                        <select
                          value={(cellVal as string) ?? ''}
                          onChange={(e) => updateCell(e.target.value)}
                          className="rounded border border-border px-2 py-1 text-xs bg-white focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                        >
                          <option value="">—</option>
                          {col.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="px-3 py-2">
                      <input
                        type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                        value={(cellVal as string) ?? ''}
                        onChange={(e) => updateCell(e.target.value)}
                        className="rounded border border-border px-2 py-1 text-xs w-28 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={field.columns.length}
                  className="px-3 py-4 text-center text-muted text-xs italic"
                >
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <Checkbox
        id={`field-${key}`}
        label={label}
        checked={!!value}
        disabled={readonly}
        onChange={(e) => onChange(key, e.target.checked)}
      />
    );
  }

  const labelEl = (
    <label htmlFor={`field-${key}`} className="block text-[11px] font-semibold text-muted uppercase tracking-wide mb-1.5">
      {label}
      {field.required && <span className="text-danger ml-0.5">*</span>}
      {readonly && <span className="ml-1.5 text-[10px] font-normal normal-case tracking-normal text-muted/50">read-only</span>}
    </label>
  );

  if (field.type === 'select') {
    return (
      <div>
        {labelEl}
        <Select
          id={`field-${key}`}
          options={(field as { options: string[] }).options}
          placeholder="Select…"
          value={(value as string) ?? ''}
          disabled={readonly}
          className={readonly ? 'bg-background text-muted cursor-default' : undefined}
          onChange={(e) => onChange(key, e.target.value || null)}
        />
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        {labelEl}
        <Textarea
          id={`field-${key}`}
          placeholder={'placeholder' in field ? (field.placeholder as string) : undefined}
          value={(value as string) ?? ''}
          readOnly={readonly}
          className={readonly ? 'bg-background text-muted cursor-default' : undefined}
          onChange={(e) => onChange(key, e.target.value)}
        />
      </div>
    );
  }

  // text | date | number | currency
  return (
    <div>
      {labelEl}
      <Input
        id={`field-${key}`}
        type={
          field.type === 'date'
            ? 'date'
            : field.type === 'number' || field.type === 'currency'
              ? 'number'
              : 'text'
        }
        placeholder={'placeholder' in field ? (field.placeholder as string) : undefined}
        value={(value as string) ?? ''}
        readOnly={readonly}
        className={readonly ? 'bg-background text-muted cursor-default' : undefined}
        onChange={(e) => onChange(key, e.target.value)}
      />
    </div>
  );
}
