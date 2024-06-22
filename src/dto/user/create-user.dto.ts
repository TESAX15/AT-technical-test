export interface CreateUserDTO {
  email: string;
  password: string;
  userRole: 'Non-Admin' | 'Admin';
}
