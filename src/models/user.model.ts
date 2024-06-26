export interface User {
  id: number;
  email: string;
  passwordHash: string;
  userRole: userRole;
  isBlocked: boolean;
}

export type userRole = 'NonAdmin' | 'Admin';
