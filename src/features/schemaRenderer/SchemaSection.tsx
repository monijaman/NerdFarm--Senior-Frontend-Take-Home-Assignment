'use client';

import type { Section, FormData } from '@/types/schema';
import type { RoleRules } from '@/types/schema';
import { getVisibleFields } from '@/lib/visibility';
import { SchemaField } from './SchemaField';

interface SchemaSectionProps {
  section: Section;
  formData: FormData;
  roleRules: RoleRules;
  onChange: (key: string, value: FormData[string]) => void;
}

export function SchemaSection({
  section,
  formData,
  roleRules,
  onChange,
}: SchemaSectionProps) {
  const visibleFields = getVisibleFields(
    section.fields,
    formData,
    roleRules.hiddenFields,
  );

  if (visibleFields.length === 0) return null;

  return (
    <section
      aria-labelledby={`section-${section.key}`}
      className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-4 shadow-sm"
    >
      {/* Section heading with accent bar */}
      <div className="flex items-center gap-2.5">
        <div className="w-0.5 h-4 bg-primary/50 rounded-full shrink-0" />
        <h3
          id={`section-${section.key}`}
          className="text-[10px] font-bold text-muted uppercase tracking-widest"
        >
          {section.heading}
        </h3>
      </div>

      {/* 2-column grid; textarea/table span full width */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        {visibleFields.map((field) => (
          <div
            key={field.key}
            className={
              field.type === 'textarea' || field.type === 'table'
                ? 'col-span-2'
                : undefined
            }
          >
            <SchemaField
              field={field}
              value={formData[field.key] ?? null}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
