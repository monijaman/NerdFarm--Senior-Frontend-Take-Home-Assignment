export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'number'
  | 'currency'
  | 'table';

export type ColumnType = 'text' | 'number' | 'date' | 'currency' | 'checkbox' | 'select';

export type ActionVariant = 'primary' | 'secondary' | 'outline' | 'destructive';

export interface Column {
  key: string;
  label: string;
  type: ColumnType;
  options?: string[];
}

export interface VisibleWhen {
  field: string;
  equals?: string | boolean;
  notEquals?: string | boolean;
}

// Discriminated union for precise field typing
export type Field =
  | BaseField
  | SelectField
  | TableField;

interface BaseField {
  key: string;
  label: string;
  type: Exclude<FieldType, 'select' | 'table'>;
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
  visibleWhen?: VisibleWhen;
}

interface SelectField {
  key: string;
  label: string;
  type: 'select';
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
  options: string[];
  visibleWhen?: VisibleWhen;
}

interface TableField {
  key: string;
  label: string;
  type: 'table';
  readonly?: boolean;
  required?: boolean;
  columns: Column[];
  editableColumns?: string[];
  visibleWhen?: VisibleWhen;
}

export interface Section {
  key: string;
  heading: string;
  fields: Field[];
}

export interface Action {
  key: string;
  label: string;
  variant: ActionVariant;
  requiresAllRequired?: boolean;
}

export interface RoleRules {
  hiddenFields: string[];
  hiddenSections?: string[];
  disabledActions: string[];
}

export interface TaskSchema {
  schemaRef: string;
  title: string;
  description: string;
  sections: Section[];
  actions: Action[];
  roleVisibility: Record<string, RoleRules>;
}

export type TableRow = Record<string, string | boolean | number | null>;

export type FormValue = string | boolean | number | null | TableRow[];

export type FormData = Record<string, FormValue>;
