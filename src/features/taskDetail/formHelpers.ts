import type { TaskSchema, FormData, RoleRules, TableRow } from '@/types/schema';
import { getVisibleFields } from '@/lib/visibility';

/**
 * Builds a default FormData object for a schema, filling in:
 * - "" for text / textarea / date / number / currency
 * - null for select
 * - false for checkbox
 * - [] for table
 */
export function buildDefaultFormData(schema: TaskSchema): FormData {
  const data: FormData = {};
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.type === 'checkbox') data[field.key] = false;
      else if (field.type === 'select') data[field.key] = null;
      else if (field.type === 'table') data[field.key] = [] as TableRow[];
      else data[field.key] = '';
    }
  }
  return data;
}

/**
 * Merges pre-populated task data on top of the schema defaults.
 * Any field not present in taskData keeps its schema default.
 */
export function mergeFormData(
  defaults: FormData,
  taskData: Record<string, unknown> | null,
): FormData {
  if (!taskData) return defaults;
  return { ...defaults, ...taskData } as FormData;
}

/**
 * Builds the submission payload, stripping fields that are:
 * - hidden by roleVisibility.hiddenFields
 * - hidden by visibleWhen conditions (not currently visible given formData)
 * - in sections hidden by roleVisibility.hiddenSections
 *
 * Only fields that were visible to the user at submission time are included.
 */
export function buildSubmissionPayload(
  taskId: string,
  actionKey: string,
  schema: TaskSchema,
  formData: FormData,
  roleRules: RoleRules,
  userId: string,
) {
  const hiddenSections = roleRules.hiddenSections ?? [];

  const visibleFormData: FormData = {};
  for (const section of schema.sections) {
    if (hiddenSections.includes(section.key)) continue;
    const visibleFields = getVisibleFields(section.fields, formData, roleRules.hiddenFields);
    for (const field of visibleFields) {
      visibleFormData[field.key] = formData[field.key] ?? null;
    }
  }

  return {
    taskId,
    action: actionKey,
    formData: visibleFormData,
    submittedAt: new Date().toISOString(),
    submittedBy: userId,
  };
}
