"use client";

import type { TaskSchema, FormData, RoleRules } from "@/types/schema";
import type { UserRole } from "@/types/user";
import { getAllVisibleRequiredFields } from "@/lib/visibility";
import { isFormValid } from "@/lib/validation";
import { Button } from "@/components/atoms/Button";
import { SchemaSection } from "./SchemaSection";

interface SchemaRendererProps {
  schema: TaskSchema;
  formData: FormData;
  activeRole: UserRole;
  onFieldChange: (key: string, value: FormData[string]) => void;
  onAction: (actionKey: string) => void;
}

export function SchemaRenderer({
  schema,
  formData,
  activeRole,
  onFieldChange,
  onAction,
}: SchemaRendererProps) {
  const roleRules: RoleRules = schema.roleVisibility[activeRole] ?? {
    hiddenFields: [],
    hiddenSections: [],
    disabledActions: [],
  };

  const hiddenSections = roleRules.hiddenSections ?? [];

  const requiredFields = getAllVisibleRequiredFields(
    schema,
    formData,
    roleRules.hiddenFields,
    hiddenSections,
  );

  const formIsValid = isFormValid(requiredFields, formData);

  return (
    <div className="flex flex-col gap-4">
      {/* Schema title card */}
      <div className="bg-surface rounded-xl border border-border px-5 py-4 shadow-sm">
        <h2 className="text-[15px] font-bold text-text">{schema.title}</h2>
        <p className="text-[12px] text-muted mt-1 leading-relaxed">
          {schema.description}
        </p>
      </div>

      {/* Sections */}
      {schema.sections.map((section) => {
        if (hiddenSections.includes(section.key)) return null;
        return (
          <SchemaSection
            key={section.key}
            section={section}
            formData={formData}
            roleRules={roleRules}
            onChange={onFieldChange}
          />
        );
      })}

      {/* Actions card */}
      <div className="bg-surface rounded-xl border border-border px-5 py-4 flex items-center gap-3 flex-wrap shadow-sm">
        {schema.actions.map((action) => {
          const isDisabledByRole = roleRules.disabledActions.includes(
            action.key,
          );
          const isDisabledByValidation =
            action.requiresAllRequired && !formIsValid;
          const disabled = isDisabledByRole || isDisabledByValidation;

          return (
            <Button
              key={action.key}
              variant={action.variant}
              disabled={disabled}
              onClick={() => onAction(action.key)}
              aria-disabled={disabled}
            >
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
