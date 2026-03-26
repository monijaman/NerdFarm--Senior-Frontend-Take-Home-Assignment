export type UserRole = 'processor' | 'attorney';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
