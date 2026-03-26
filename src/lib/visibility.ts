import type { Field, FormData } from '@/types/schema';

/**
 * Evaluates whether a field should be visible given the current form data.
 * If the controlling field has no value (null / undefined / ''), the dependent
 * field is always hidden — regardless of equals/notEquals condition.
 */
export function evaluateVisibleWhen(field: Field, formData: FormData): boolean {
  if (!field.visibleWhen) return true;

  const { field: controlKey, equals, notEquals } = field.visibleWhen;
  const controlValue = formData[controlKey];

  // Controlling field unset → hide dependent
  if (controlValue === null || controlValue === undefined || controlValue === '') {
    return false;
  }

  if (equals !== undefined) return controlValue === equals;
  if (notEquals !== undefined) return controlValue !== notEquals;

  return true;
}

/**
 * Returns fields that are visible after applying both visibleWhen logic
 * and role-based hiddenFields.
 */
export function getVisibleFields(
  fields: Field[],
  formData: FormData,
  hiddenFields: string[],
): Field[] {
  return fields.filter(
    (f) => !hiddenFields.includes(f.key) && evaluateVisibleWhen(f, formData),
  );
}

/**
 * Collects all visible, required fields across ALL sections,
 * respecting both hiddenSections and hiddenFields from roleVisibility.
 */
export function getAllVisibleRequiredFields(
  schema: { sections: Array<{ key: string; fields: Field[] }> },
  formData: FormData,
  hiddenFields: string[],
  hiddenSections: string[],
): Field[] {
  const result: Field[] = [];
  for (const section of schema.sections) {
    if (hiddenSections.includes(section.key)) continue;
    const visible = getVisibleFields(section.fields, formData, hiddenFields);
    result.push(...visible.filter((f) => f.required));
  }
  return result;
}
