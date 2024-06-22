export interface AuthenticatedUser {
  id: number;
  email: string;
  userRole: 'Non-Admin' | 'Admin';
}
