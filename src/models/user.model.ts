export interface User {
  id: number;
  email: string;
  passwordHash: string;
  userRole: 'Non-Admin' | 'Admin';
  blocked: boolean;
}
