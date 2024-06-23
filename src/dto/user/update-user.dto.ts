export interface UpdateUserDTO {
  email: string;
  password: string;
  userRole: 'Non-Admin' | 'Admin';
  isBlocked: boolean;
}
