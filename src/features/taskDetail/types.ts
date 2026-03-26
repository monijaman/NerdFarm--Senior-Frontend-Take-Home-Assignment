import type { TaskSchema, FormData } from '@/types/schema';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type State = {
  schema: TaskSchema | null;
  formData: FormData;
  status: Status;
};

export type Action =
  | { type: 'RESET' }
  | { type: 'LOADING' }
  | { type: 'LOADED'; schema: TaskSchema; formData: FormData }
  | { type: 'ERROR' }
  | { type: 'FIELD_CHANGE'; key: string; value: FormData[string] };
