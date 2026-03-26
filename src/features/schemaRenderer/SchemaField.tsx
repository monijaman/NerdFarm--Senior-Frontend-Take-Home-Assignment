'use client';

import { useState, useCallback } from 'react';
import type { Field, FormData, TableRow } from '@/types/schema';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Checkbox } from '@/components/atoms/Checkbox';
import { formatCurrency } from '@/lib/format';
import {getErrors} from '@/components';

interface SchemaFieldProps {
  field: Field;
  value: FormData[string];
  onChange: (key: string, value: FormData[string]) => void;
  formData?: FormData;
}

export function SchemaField({ field, value, onChange }: SchemaFieldProps) {
  const { key, label, readonly } = field;
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const errorId = `field-${key}-error`;

  const handleFieldBlur = useCallback(() => {
    if ('validation' in field && field.validation) {
      const errors = getErrors(
        { [key]: String(value ?? '') },
        { [key]: field.validation }
      );
      setFieldErrors(errors[key] ?? []);
    }
  }, [key, value, field]);

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
                        <Checkbox
                          label=""
                          checked={!!cellVal}
                          onChange={(e) => updateCell(e.target.checked)}
                          aria-label={`${field.label} row ${rowIdx + 1} ${col.label}`}
                        />
                      </td>
                    );
                  }

                  if (col.type === 'select' && col.options) {
                    return (
                      <td key={col.key} className="px-3 py-2">
                        <Select
                          value={(cellVal as string) ?? ''}
                          onChange={(e) => updateCell(e.target.value)}
                          options={col.options}
                          className="text-xs"
                          aria-label={`${field.label} row ${rowIdx + 1} ${col.label}`}
                        />
                      </td>
                    );
                  }

                  return (
                    <td key={col.key} className="px-3 py-2">
                      <Input
                        type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                        value={(cellVal as string) ?? ''}
                        onChange={(e) => updateCell(e.target.value)}
                        className="text-xs w-28"
                        aria-label={`${field.label} row ${rowIdx + 1} ${col.label}`}
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
        {fieldErrors.length > 0 && (
          <div id={errorId} className="mt-1 text-[11px] text-danger">
            {fieldErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
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
        aria-required={field.required ?? false}
        aria-invalid={fieldErrors.length > 0}
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
          onBlur={handleFieldBlur}
          error={fieldErrors.length > 0}
          aria-required={field.required ?? false}
          aria-invalid={fieldErrors.length > 0}
          aria-describedby={fieldErrors.length > 0 ? errorId : undefined}
        />
        {fieldErrors.length > 0 && (
          <div id={errorId} className="mt-1 text-[11px] text-danger">
            {fieldErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
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
          onBlur={handleFieldBlur}
          error={fieldErrors.length > 0}
        />
        {fieldErrors.length > 0 && (
          <div className="mt-1 text-[11px] text-danger">
            {fieldErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}
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
        aria-required={field.required ?? false}
        aria-invalid={fieldErrors.length > 0}
        aria-describedby={fieldErrors.length > 0 ? errorId : undefined}
      />
      {fieldErrors.length > 0 && (
        <div id={errorId} className="mt-1 text-[11px] text-danger">
          {fieldErrors.map((err, i) => <div key={i}>{err}</div>)}
        </div>
      )}
    </div>
  );
}
