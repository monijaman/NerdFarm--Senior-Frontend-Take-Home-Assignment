import type { Field, FormData } from '@/types/schema';

/**
 * Returns true if the field has a valid, filled value for validation purposes.
 * - checkbox: must be true (checked)
 * - select: must be a non-empty string
 * - table: always passes (tables don't gate submission)
 * - others: must be non-empty string / non-null
 */
export function isFieldFilled(field: Field, formData: FormData): boolean {
  const value = formData[field.key];
  if (field.type === 'checkbox') return value === true;
  if (field.type === 'table') return true;
  return value !== null && value !== undefined && value !== '';
}

/**
 * Returns true if all provided required fields are filled.
 * Used to gate primary action buttons with requiresAllRequired.
 */
export function isFormValid(requiredFields: Field[], formData: FormData): boolean {
  return requiredFields.every((f) => isFieldFilled(f, formData));
}
