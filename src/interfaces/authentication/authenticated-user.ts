import { userRole } from '../../models/user.model';

export interface AuthenticatedUser {
  id: number;
  email: string;
  userRole: userRole;
}
